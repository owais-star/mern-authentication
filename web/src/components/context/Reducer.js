export const reducer = (state, action) => {
    switch (action.type) {
  
      case "USER_LOGIN": {
        if (
          action.payload.firstName &&
          action.payload.lastName &&
          action.payload.email) {
  
          return { ...state, user: action.payload }
  
        } else {
          console.log(`invalid data in USER_LOGIN reducer `);
          return state;
        }
      }
      case "USER_LOGOUT": {
        return { ...state, user: null } // set this to null on purpose, do not change
      }
  
  
      default: {
        return state
      }
    }
  }