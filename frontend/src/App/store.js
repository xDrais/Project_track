import { createStore, combineReducers , applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import {userLoginReducer, userReducers, userRegisterReducer,
  forgetPassword,resetPassword,
  sponsorReducer,coachReducer} from '../userredux/userreducer'



//el store houwa objet bch ykounou fih des données partagées bin el components lkol


const reducer = combineReducers({
    //reducers
    

    userLogin : userLoginReducer,
    userRegister : userRegisterReducer,
    userDisplay : userReducers,
    forgetPassword: forgetPassword,
    resetpass: resetPassword,
    sponsorReducer:sponsorReducer,
    coachReducer:coachReducer,
   
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null 

const initialState ={
        //localstorage
        userLogin : {userInfo: userInfoFromStorage},
        userDisplay: {
          userInfo: userInfoFromStorage
        },
  }
  const middleware = [thunk]
  
  const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware)));
  
  export default store 