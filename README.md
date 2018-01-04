# Nalda

A centralized source for information, food, activities, and fun on your campus.

__Stack used:__
* `React` JavaScript framework for all views
* `Redux` overarching application state
* `Passport` user authentication
* `Node` JavaScript on the backend
* `Express` backend API library
* `MongoDB` database

View the timesheet [here.](https://docs.google.com/spreadsheets/d/1FaistICZ-BuORu7YYm5fFpgii2cvxZKgEpxApWQ_3pY/edit?usp=sharing)

To run the application, run `npm start`. For more responsive hot-reloading on the backend and frontend, run `npm run frontend` and `npm run backend` concurrently.

## Currently Working on:
Backend for articles and listings

## Admins

- [X] Admin add page (similar look to contact page) where admins can enter email addresses and add both other admins and other content creators. Only admins can add people as content creators and only content creators can create posts.
- [X] Allow admins to update a user's privileges (ex. from user to curator)
- [X] Protect `admin`, `curator`, and `user` routes.
- [ ] Allow `users` to leave reviews: comments and ratings.

## Users

- [ ] SendGrid configuration
  - [ ] Contact page
  - [ ] Password reset
  - [ ] Device authorization (confirm your email)?
- [ ] Add author field to every form of content
  - [ ] Videos
  - [ ] Listings
  - [ ] Articles
- [ ] Curator show pages
  * This should display all of the content a curator has written
- [X] Default create users with type `user`. Admin can switch them to `admin` or `curator`
- [ ] Give users ability to set and change profile pictures, update this in new article/listing/video backend
- [ ] Make it so you can click and view author pages, author page should also list all their articles

## Listings

- [ ] Store an array of times or two fields for each day
- [ ] Store reviews / comments on listings
- [ ] Form for adding reviews
- [ ] Complete listing view
- [X] Complete listing backend (already stores listing in Mongo, just need to populate to home screen.
- [X] Figure out why listings page is not displaying

## Videos

- [ ] Improve styling
- [ ] Video backend

## Frontend

- [X] Setting up SCSS
- [ ] Video styling
- [ ] Login/Register/Reset/Edit Account Form styling
- [ ] Sendgrid configuration for sending emails
- [X] Individual listing view
- [ ] Ajax search suggestions
- [ ] Routing 	
- [ ] User show pages
- [X] Footer
- [X] Article form display
- [X] Video form display
- [X] Listing form display
- [ ] Login/Register/Reset/Edit Account Form styling
- [ ] Ajax search suggestions
- [ ] Incorporate Nalda logo and other advice from Edward
- [ ] Home page needs to have other ways of sorting: most popular, by category, by author?, etc
- [ ] Side Nav Bar should close once an option is clicked
- [ ] Nav bar should only show name and location when a user is logged in
- [ ] Make it easier for an admin to enter hours (some sort of autofill)
- [ ] Icons for all amenities
- [X] Get rid of article reducer
- [ ] Style nav bar so it looks okay when no user is logged in (no user or location)
- [ ] Create a curator profile view (Should show name, location, bio, contact info, and all content created)

## Backend

- [X] Boilerplate setup
- [X] MongoDB setup
- [X] React/Redux setup
- [X] Setting up component structures
- [X] Password security
- [ ] HTTPS
- [ ] Searching functionality
  * A user should be able to search for `articles`, `videos`, `listings`, and `curators` (those who create content).
- [ ] Recommending content for users to look at
  * To begin they can be location based and random
- [ ] Domain registration/setup
- [ ] Better user auth checks on the backend
- [ ] Better parameter error checking on the backend
- [ ] Link user data to posted article
- [ ] Give content a timestamp
  - [ ] Videos
  - [ ] Listings
  - [X] Articles
- [ ] Split up `routes.js` into many smaller files
- [ ] Sort reviews functionality (time, rating)
- [ ] Deal with location
- [ ] Curator profile view
- [ ] Change/forgot password backend
- [ ] Replace dummy location, profile picture, and bio data
- [ ] Replace dummy data in `Account.js`
- [ ] Add bio and content to `user` schema

## Cam
- [ ] Nav bar style when no one is logged in
- [ ] Style curator profile view (`Profile.js`). Add profile picture spot!
- [ ] Make it so nav bar closes when user clicks something

## Other

- [X] Make a check in the `AppContainer` component to ensure that `passport` and `redux` are in sync (`redux persist`) makes it such that this can outlast the backend session
- [ ] Style about page
- [ ] General clean up, get rid of console.logs and deal with errors better
- [ ] Change title tag, description, other meta tags depending on the page
- [ ] Get rid of redux capabilities of all components that don't use redux
- [ ] Go back and take care of all TODO's
- [ ] Make sure all form submissions check for empty fields on frontend and/or backend

## Bugs
- [ ] Fix authentication route bug
  * When you refresh on a page that requires authentication it redirects to the home page (this should not be the case if the session persists)
- [ ] Bug where login error crashes app instead of displaying error
  - [ ] 'Cannot set headers after they are sent' error crashes app
- [X] Persist issue, now it makes you log back in all the time. Perhaps passport session is very short?

## Questions

* Should multiple curators be able to contribute to content or just one?
* What role should location play in the application?
  * How should we get a user's location?
  * Should all content have a location?
  * Should we only show content near the user?
* What information do you want on the about page?
