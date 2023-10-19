/* eslint-disable no-duplicate-case */
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
     USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, 
     USER_REGISTER_FAIL, GET_USERS_SUCCESS, APPROVE_USER_SUCCESS, 
     FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, FORGET_PASSWORD_FAIL, 
     RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL, UNBLOCK_USER, 
     USER_BLOCK_SUCCESS, ADD_COACH_REQUEST, ADD_COACH_SUCCESS, ADD_COACH_FAIL, ADD_SPONSOR_REQUEST,
      ADD_SPONSOR_SUCCESS, ADD_SPONSOR_FAIL,UPDATE_USER_REQUEST,UPDATE_USER_FAIL,UPDATE_USER_SUCCESS
      ,UPDATE_COACH_REQUEST,UPDATE_COACH_FAIL,UPDATE_COACH_SUCCESS,UPDATE_SPONSOR_REQUEST,UPDATE_SPONSOR_FAIL,
      UPDATE_SPONSOR_SUCCESS } from "./userconstant";

 export const userLoginReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case USER_LOGIN_REQUEST : 
            return {loading : true}
        case USER_LOGIN_SUCCESS : 
            return {loading : false , userInfo : action.payload}
        case USER_LOGIN_FAIL :
            return {loading : false , error: action.payload }        
        case USER_LOGOUT:
            return {}
        default:
            return state    

    }
 }
 export const userRegisterReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case USER_REGISTER_REQUEST : 
            return {loading : true}
        case USER_REGISTER_SUCCESS : 
            return {loading : false ,messageSuccess : "WE SENT YOU A VERIFICATION E-MAIL!"}
        case USER_REGISTER_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
 }

 export const userReducers = (state={}, action) => {
    switch (action.type) {
      case GET_USERS_SUCCESS:
        return {  userInfo: action.payload };
      case APPROVE_USER_SUCCESS:
        const updatedUsers = state.userInfo.map((user) =>
          user._id === action.payload.id ? { ...user, role: action.payload.role } : user
        );
        return { userInfo: updatedUsers };
      default:
        return state;
    }
  };

  export const forgetPassword=(state={},action)=>{
    switch (action.type) {
        case FORGET_PASSWORD_REQUEST : 
            return {loading : true}

        case FORGET_PASSWORD_SUCCESS : 
            return {loading : false, success: true }
        case FORGET_PASSWORD_FAIL :
            return {loading : false ,error: action.payload }    
        default:
            return state    

    }
}
export const resetPassword=(state={},action)=>{
    switch (action.type) {
        case RESET_PASSWORD_REQUEST : 
            return {loading : true}
        case RESET_PASSWORD_SUCCESS : 
            return {loading : false }
        case RESET_PASSWORD_FAIL :
            return {loading : false  ,error: action.payload }       
        default:
            return state    

    }
}

export const userBlockReducer = (state = { users: [] }, action) => {
    switch (action.type) {
      case USER_BLOCK_SUCCESS:
        return {
          ...state,
          users: state.users.map((user) =>
            user._id === action.payload._id ? { ...user, bloque: true } : user
          ),
        };
      default:
        return state;
    }
  };
  export const userUnblockReducer = (state = { users: [] }, action) => {
    switch (action.type) {
      case UNBLOCK_USER:
        return {
          ...state,
          users: state.users.map((user) =>
            user._id === action.payload._id ? { ...user, bloque: true } : user
          ),
        };
      default:
        return state;
    }
  };

  export const userVerifyReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case USER_REGISTER_REQUEST : 
            return {loading : true}
        case USER_REGISTER_SUCCESS : 
            return {loading : false , userInfo : action.payload}
        case USER_LOGIN_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
 }
 export const coachReducer=(state={},action)=>{
  // eslint-disable-next-line default-case
  switch (action.type) {
      case ADD_COACH_REQUEST : 
          return {loading : true}
      case ADD_COACH_SUCCESS : 
          return {loading : false , succes : true}
      case ADD_COACH_FAIL :
          return {loading : false , error: action.payload }        
      default:
          return state    

  }
}
 export const sponsorReducer=(state={},action)=>{
  // eslint-disable-next-line default-case
  switch (action.type) {
      case ADD_SPONSOR_REQUEST : 
          return {loading : true}
      case ADD_SPONSOR_SUCCESS : 
          return {loading : false , succes : true}
      case ADD_SPONSOR_FAIL :
          return {loading : false , error: action.payload }        
      default:
          return state    

  }
}

export const userUpdateReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case UPDATE_USER_REQUEST : 
            return {loading : true}
        case UPDATE_USER_SUCCESS : 
            return {loading : false ,messageSuccess : "User Updated!"}
        case UPDATE_USER_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
 }

 export const coachUpdateReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case UPDATE_COACH_REQUEST : 
            return {loading : true}
        case UPDATE_COACH_SUCCESS : 
            return {loading : false ,messageSuccess : "Coach Updated!"}
        case UPDATE_COACH_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
 }
 export const sponsorUpdateReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case UPDATE_SPONSOR_REQUEST : 
            return {loading : true}
        case UPDATE_SPONSOR_SUCCESS : 
            return {loading : false ,messageSuccess : "Sponsor Updated!"}
        case UPDATE_SPONSOR_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
 }