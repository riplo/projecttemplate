// Actions which will be dispatched to the reducers (authReducer.js)

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId, userType, name, location, profilePicture) {
  return {
    type: 'LOGIN',
    userId,
    userType,
    name,
    location,
    profilePicture,
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
export function register(userId, userType, name, location, profilePicture) {
  return {
    type: 'REGISTER',
    userId,
    userType,
    name,
    location,
    profilePicture,
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}
