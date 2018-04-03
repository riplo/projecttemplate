# Riplo

Project template to dive quickly into other projects. Developed by @adamripley98 and @ccabo1.

__Stack used:__
* `React` JavaScript framework for all views
* `Redux` overarching application state
* `Passport` user authentication (local, facebook, google)
* `Node` JavaScript on the backend
* `Express` backend API library
* `MongoDB` database
* `AWS S3` image upload (drag and drop) and storage
* `Redux Persist` persistent state between refreshes

To run the application, run `npm start`. For more responsive hot-reloading on the backend and frontend, run `npm run frontend` and `npm run backend` concurrently.

Note: `env.sh` file must contain: `MONGODB_URI`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_APP_CALLBACK`, `GOOGLE_APP_ID`, `GOOGLE_APP_SECRET`, `GOOGLE_APP_CALLBACK`, `SENDGRID_API_KEY`,`SENDGRID_EMAIL`, and `HOST_URL`

# TODO
- [ ] Replace all nalda images with riplo images
- [ ] Convert to simple nav bar (no sidebar)
- [ ] Change all components to have only one handleChange, get rid of individual handle change xxx methods
- [X] Redo AWS with better style
- [ ] Change curator and admin names to be only users and admins:`RequireAdmin.js`, `RequireLogin.js`, `RequireCurator.js`, `authChecking.js`
- [ ] Make generic account page `Account.js`
- [ ] Make generic admin page
- [X] Make `InfoMessage.js` generic shared component
- [X] Uninstall unused packages
- [X] Update read me with instructions on setting up mongo, fb oauth, google oauth, sendgrid, AWS, etc.
- [ ] `forgot.js`, `verify.js`, `register.js` email sent should be in helperMethods
- [ ] fix fb array passing issue in `init.js`
- [X] Get rid of location
- [X] Image upload stuff in its own component
- [X] Size restrictions and type checking on images
- [ ] Change `contact.js` to be `email.js` and include all instances of sending email, get rid of `sendEmail.js` most likely.
- [ ] Clean up excess CSS
- [ ] Delete user account functionality
- [X] Get rid of AWS stuff
- [X] Get rid of location
- [ ] Split up first and last name

# Next iteration of template
- [ ] Effective AWS S3
  - [ ] Image upload in its own component
  - [ ] Deleting images after content deletion
  - [ ] Storing multiple sizes
  - [ ] Delete user acount functionality
