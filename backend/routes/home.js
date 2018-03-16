/**
 * Handles all backend routes for homepage
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const uuid = require('uuid-v4');
const async = require('async');

// Import database models
const Article = require('../models/article');
const Listing = require('../models/listing');
const Video = require('../models/video');
const Homepage = require('../models/homepage');

// Import helper methods
const {AdminCheck} = require('../helperMethods/authChecking');

// Isolate environmental variables
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_USER_KEY = process.env.AWS_USER_KEY;
const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

// Set up bucket
const s3bucket = new AWS.S3({
  accessKeyId: AWS_USER_KEY,
  secretAccessKey: AWS_USER_SECRET,
  Bucket: AWS_BUCKET_NAME,
});

// Export the following methods for routing
module.exports = () => {
  /**
   * Get content for the homepage
   */
  router.get('/', (req, res) => {
    // Helper function to pull data for each of the different content types
    const pullData = (arr, callback) => {
      // Array of content to be returned
      const returnArr = [];

      // Loop through array and pull pertinent data
      async.eachSeries(arr, (item, cb) => {
        // Find the model for pulling data based on the content type
        let Model = null;
        if (item.contentType === 'article') {
          Model = Article;
        } else if (item.contentType === 'listing') {
          Model = Listing;
        } else {
          Model = Video;
        }

        // Find given content
        Model.findById(item.contentId, (errContent, content) => {
          if (errContent) {
            callback({
              success: false,
              error: 'There was an error fetching homepage content',
            });
          } else if (content) {
            let newContent = {};
            if (item.contentType === 'article') {
              newContent = {
                contentType: item.contentType,
                contentId: item.contentId,
                title: content.title,
                subtitle: content.subtitle,
                image: content.image,
                createdAt: content.createdAt,
                updatedAt: content.updatedAt,
                location: content.location,
              };
            } else if (item.contentType === 'listing') {
              newContent = {
                contentType: item.contentType,
                contentId: item.contentId,
                title: content.title,
                description: content.description,
                location: content.location,
                image: content.image,
                rating: content.rating,
                price: content.price,
                categories: content.categories,
              };
            } else {
              // Content is a video
              newContent = {
                contentType: item.contentType,
                contentId: item.contentId,
                title: content.title,
                description: content.description,
                url: content.url,
                location: content.location,
                createdAt: content.createdAt,
                updatedAt: content.updatedAt,
              };
            }

            // Add the new content to the array and continue looping
            returnArr.push(newContent);
            cb();
          }
        });
      }, (asyncErr) => {
        if (asyncErr) {
          callback({
            success: false,
            error: 'Error loading homepage.'
          });
        } else {
          callback({
            success: true,
            error: '',
            returnArr,
          });
          return;
        }
      });
    };

    Homepage.find({}, (errHome, home) => {
      if (errHome) {
        res.send({
          success: false,
          error: 'Cannot return homepage.',
        });
      } else {
        const homepage = home[0];
        pullData(homepage.fromTheEditors, (editorsResp) => {
          if (!editorsResp.success) {
            res.send({
              success: false,
              error: editorsResp.error,
            });
          } else {
            const fromTheEditors = editorsResp.returnArr;
            pullData(homepage.naldaVideos, (videosResp) => {
              if (!videosResp.success) {
                res.send({
                  success: false,
                  error: videosResp.error,
                });
              } else {
                const naldaVideos = videosResp.returnArr;
                pullData(homepage.recommended, (recResp) => {
                  if (!recResp.success) {
                    res.send({
                      success: false,
                      error: recResp.error,
                    });
                  } else {
                    const recommended = recResp.returnArr;
                    res.send({
                      success: true,
                      error: '',
                      data: {
                        banner: homepage.banner,
                        fromTheEditors,
                        naldaVideos,
                        recommended,
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage recommended
  router.post('/recommended/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Listing.findById(contentId, (errListing, listing) => {
          if (errListing) {
            res.send({
              success: false,
              error: 'Error finding content.'
            });
          // Make sure id is of right format
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No listing with that id exists.'
            });
            // Make sure content with given id exists
          } else if (!listing) {
            res.send({
              success: false,
              error: 'No listing with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const recommended = homepage.recommended.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                recommended.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This listing is already in the recommended content section.',
                  });
                } else {
                  // Create object to pass back, of type listing
                  const newRecommendedContent = {
                    contentType: 'listing',
                    contentId,
                  };
                  // Add to Recommended
                  recommended.push(newRecommendedContent);
                  homepage.recommended = recommended;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding recommended.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.recommended,
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  });

  // Route to handle deleting an item from the recommended
  router.post('/recommended/remove/:recommendedContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.recommendedContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (err, home) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error retrieving homepage data.',
            });
          } else {
            const homepage = home[0];
            const recommended = homepage.recommended.slice();
            // Loop through to delete specific item
            recommended.forEach((item) => {
              if (item.contentId === contentId) {
                recommended.splice(recommended.indexOf(item), 1);
                return;
              }
            });
            homepage.recommended = recommended;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error removing recommended.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.recommended,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage from the editors
  router.post('/fromTheEditors/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Article.findById(contentId, (errArticle, article) => {
          if (errArticle) {
            res.send({
              success: false,
              error: 'Error finding article.'
            });
          // Make sure id is of right format
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No article with that id exists.'
            });
            // Make sure article with given id exists
          } else if (!article) {
            res.send({
              success: false,
              error: 'No article with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const fromTheEditors = homepage.fromTheEditors.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                fromTheEditors.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This article is already in the from the editors content section.',
                  });
                } else {
                  // Create object to pass back, of type article
                  const newFromTheEditorsContent = {
                    contentType: 'article',
                    contentId,
                  };
                  // Add to from the editors
                  fromTheEditors.push(newFromTheEditorsContent);
                  homepage.fromTheEditors = fromTheEditors;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding content to homepage.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.fromTheEditors,
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  });

  // Route to handle deleting an item from the from the editors
  router.post('/fromTheEditors/remove/:fromTheEditorsContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.fromTheEditorsContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (err, home) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error retrieving homepage data.',
            });
          } else {
            const homepage = home[0];
            const fromTheEditors = homepage.fromTheEditors.slice();
            // Loop through to delete specific item
            fromTheEditors.forEach((item) => {
              if (item.contentId === contentId) {
                fromTheEditors.splice(fromTheEditors.indexOf(item), 1);
                return;
              }
            });
            homepage.fromTheEditors = fromTheEditors;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: "error removing homeepage content.",
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.fromTheEditors,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage nalda videos
  router.post('/naldaVideos/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        const contentId = req.body.contentId;
        Video.findById(contentId, (errVideo, video) => {
          if (errVideo) {
            res.send({
              success: false,
              error: 'Error finding content.'
            });
          } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
            res.send({
              success: false,
              error: 'No video with that id exists.'
            });
            // Make sure content with given id exists
          } else if (!video) {
            res.send({
              success: false,
              error: 'No video with that ID exists.',
            });
          } else {
            Homepage.find({}, (errHomepage, home) => {
              if (errHomepage) {
                res.send({
                  success: false,
                  error: 'Error loading homepage.',
                });
              } else {
                const homepage = home[0];
                const naldaVideos = homepage.naldaVideos.slice();
                // Error check for duplicate content in banner
                let duplicate = false;
                naldaVideos.forEach((item) => {
                  if (item.contentId === contentId) {
                    duplicate = true;
                  }
                });
                if (duplicate) {
                  res.send({
                    success: false,
                    error: 'This content is already in the Nalda Videos content section.',
                  });
                } else {
                  // Create object to pass back, of type article or listing
                  const newNaldaVideoContent = {
                    contentType: 'video',
                    contentId,
                  };
                  // Add to Nalda Video
                  naldaVideos.push(newNaldaVideoContent);
                  homepage.naldaVideos = naldaVideos;
                  // Save new banner to mongo
                  homepage.save((errSave) => {
                    if (errSave) {
                      res.send({
                        success: false,
                        error: 'Error adding content to homepage.',
                      });
                    } else {
                      res.send({
                        success: true,
                        error: '',
                        data: homepage.naldaVideos,
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  });

  // Route to handle deleting an item from the nalda videos
  router.post('/naldaVideos/remove/:naldaVideosContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.naldaVideosContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (err, home) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error retrieving homepage data.',
            });
          } else {
            const homepage = home[0];
            const naldaVideos = homepage.naldaVideos.slice();
            // Loop through to delete specific item
            naldaVideos.forEach((item) => {
              if (item.contentId === contentId) {
                naldaVideos.splice(naldaVideos.indexOf(item), 1);
                return;
              }
            });
            homepage.naldaVideos = naldaVideos;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error removing content from homepage.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.naldaVideos,
                });
              }
            });
          }
        });
      }
    });
  });

  // Route to handle adding content to homepage banner
  router.post('/banner/add', (req, res) => {
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        // Isolate body params
        const contentId = req.body.bannerContentId;
        const contentImage = req.body.bannerImageToAdd;
        // Attempt to find content in listing or article
        Listing.findById(contentId, (errListing, listing) => {
          Article.findById(contentId, (errArticle, article) => {
            // Pass back errors
            if (errListing || errArticle) {
              res.send({
                success: false,
                error: 'Error finding content.',
              });
              // Make sure id is of right format
            } else if (!contentId.match(/^[0-9a-fA-F]{24}$/)) {
              res.send({
                success: false,
                error: 'No content with that id exists.'
              });
              // Make sure content with given id exists
            } else if (!article && !listing) {
              res.send({
                success: false,
                error: 'No article or listing with that ID exists.',
              });
            } else {
              // Convert article picture to a form that s3 can display
              const imageConverted = new Buffer(contentImage.replace(/^data:image\/\w+;base64,/, ""), 'base64');
              // Create bucket
              s3bucket.createBucket(() => {
                var params = {
                  Bucket: AWS_BUCKET_NAME,
                  Key: `bannerpictures/${uuid()}`,
                  ContentType: 'image/jpeg',
                  Body: imageConverted,
                  ContentEncoding: 'base64',
                  ACL: 'public-read',
                };
                // Upload photo
                s3bucket.upload(params, (errUpload, data) => {
                  if (errUpload) {
                    res.send({
                      success: false,
                      error: 'Error uploading profile picture.',
                    });
                  } else {
                    // Find homepage
                    Homepage.find({}, (errHomepage, home) => {
                      if (errHomepage) {
                        res.send({
                          success: false,
                          error: 'Error finding homepage.',
                        });
                      // NOTE this is only to declare a homepage in the database for the first time
                      } else if (!home.length) {
                        // Create new homepage
                        const newHomepage = new Homepage({
                          banner: [],
                          naldaVideos: [],
                          categories: [],
                          recommended: [],
                          fromTheEditors: [],
                        });
                        // save new homepage in mongo
                        newHomepage.save((err) => {
                          if (err) {
                            res.send({
                              success: false,
                              error: 'Error on homepage.',
                            });
                          } else {
                            res.send({
                              success: false,
                              error: 'You just created the first instance of a homepage, try adding a banner again.',
                            });
                          }
                        });
                      } else {
                        const homepage = home[0];
                        const banner = homepage.banner.slice();
                        // Error check for duplicate content in banner
                        let duplicate = false;
                        banner.forEach((item) => {
                          if (item.contentId === contentId) {
                            duplicate = true;
                          }
                        });
                        if (duplicate) {
                          res.send({
                            success: false,
                            error: 'This content is already in the banner.',
                          });
                        } else {
                          // Create object to pass back, of type article or listing
                          const newBannerContent = {
                            contentType: article ? "article" : "listing",
                            contentId,
                            contentImage: data.Location,
                          };
                          // Add to banner
                          banner.push(newBannerContent);
                          homepage.banner = banner;
                          // Save new banner to mongo
                          homepage.save((errSave) => {
                            if (errSave) {
                              res.send({
                                success: false,
                                error: 'Error saving image.',
                              });
                            } else {
                              // Send back success
                              res.send({
                                success: true,
                                error: '',
                                data: homepage.banner,
                              });
                            }
                          });
                        }
                      }
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  });

  // Route to handle deleting an item from the banner
  router.post('/banner/remove/:bannerContentId', (req, res) => {
    // Find the id from the url
    const contentId = req.params.bannerContentId;
    AdminCheck(req, (authRes) => {
      if (!authRes.success) {
        res.send({
          success: false,
          error: authRes.error,
        });
      } else {
        Homepage.find({}, (err, home) => {
          if (err) {
            res.send({
              success: false,
              error: 'Error retrieving homepage data.',
            });
          } else {
            const homepage = home[0];
            const banner = homepage.banner.slice();
            // Loop through to delete specific item
            banner.forEach((item) => {
              if (item.contentId === contentId) {
                banner.splice(banner.indexOf(item), 1);
                return;
              }
            });
            homepage.banner = banner;
            homepage.save((errHome) => {
              if (errHome) {
                res.send({
                  success: false,
                  error: 'Error remvoing content.',
                });
              } else {
                res.send({
                  success: true,
                  error: '',
                  data: homepage.banner,
                });
              }
            });
          }
        });
      }
    });
  });

  return router;
};
