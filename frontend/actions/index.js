// Actions which will be dispatched to the reducers (authReducer.js)

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId, userType, first) {
  return {
    type: 'LOGIN',
    userId,
    userType,
    first,
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
export function register(userId, userType, first) {
  return {
    type: 'REGISTER',
    userId,
    userType,
    first,
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}
