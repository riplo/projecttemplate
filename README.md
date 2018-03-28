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

# TODO
- [ ] Replace all nalda images with riplo images
- [ ] Convert to simple nav bar (no sidebar)
- [ ] Change all components to have only one handleChange, get rid of individual handle change xxx methods
- [ ] Redo AWS with better style
- [ ] Change curator and admin names to be admins and gods `RequireAdmin.js`, `RequireLogin.js`, `RequireCurator.js`, `authChecking.js`
- [ ] Make generic account page `Acccount.js`
- [ ] Make `InfoMessage.js` generic shared component
- [ ] Uninstall unused packages
- [ ] Update read me with instructions on setting up mongo, fb oauth, google oauth, sendgrid, etc.
- [ ] `forgot.js` email sent should be in helperMethods
- [ ] move all AWS stuff to helperMethods
