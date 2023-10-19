import axios from 'axios'
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST,
   USER_LOGIN_SUCCESS,USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS ,USER_REGISTER_FAIL,
    APPROVE_USER_SUCCESS, GET_USERS_SUCCESS, FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, 
    FORGET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL, 
    BLOCK_USER, UNBLOCK_USER, USER_VERIFY_REQUEST, USER_VERIFY_SUCCESS, USER_VERIFY_FAIL, USER_BLOCK_REQUEST,
     USER_BLOCK_SUCCESS, USER_BLOCK_FAIL, ADD_COACH_REQUEST, ADD_COACH_SUCCESS, ADD_COACH_FAIL, ADD_SPONSOR_REQUEST, 
     ADD_SPONSOR_SUCCESS, ADD_SPONSOR_FAIL,UPDATE_USER_REQUEST,UPDATE_USER_FAIL,UPDATE_USER_SUCCESS 
     ,UPDATE_COACH_REQUEST,UPDATE_COACH_FAIL,UPDATE_COACH_SUCCESS,UPDATE_SPONSOR_REQUEST,UPDATE_SPONSOR_FAIL,
     UPDATE_SPONSOR_SUCCESS} from "./userconstant"
import { useNavigate ,  redirect } from 'react-router-dom'
import { CART_LOAD_ITEMS } from '../cartredux/cartconstant'

export const login = (email,password) => async (dispatch)=>{
    try {
        dispatch({
            type:USER_LOGIN_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post(
            'http://localhost:5000/api/user/login',
            { email, password },
       
            config
          );

        dispatch({
            type : USER_LOGIN_SUCCESS,
            payload : data
        }) 
        const cartItems = JSON.parse(localStorage.getItem(`cartItems_${data._id}`)) || [];
        dispatch({ type: CART_LOAD_ITEMS, payload: cartItems }); 
        localStorage.setItem('userInfo', JSON.stringify(data))
   
    


    } catch(error){
      if (error.response && error.response.data.message === 'Invalid Credentials !') {
          dispatch({
              type: USER_LOGIN_FAIL,
              payload: error.response.data.message
          });

    }
}}
export const register = ({firstName,lastName,cin,phone,dateOfBirth,imageUrl,email,password,speciality,descriptionCoach,dateDebutExperience,dateFinExperience,titrePoste,certification,entrepriseName,sector,descriptionSponsor,file,fil,messageL}) => async (dispatch)=>{
  try {
        dispatch({
            type:USER_REGISTER_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        }

        const { data } = await axios.post(
            'http://localhost:5000/api/user/register',
            {firstName,lastName,cin,phone,dateOfBirth,imageUrl, email, password,speciality,descriptionCoach,dateDebutExperience,dateFinExperience,titrePoste,certification,entrepriseName,sector,descriptionSponsor,file,fil,messageL },
            config
          );

        dispatch({
            type : USER_REGISTER_SUCCESS,
            payload : data
        })
     
       // localStorage.setItem('userInfo', JSON.stringify(data))

       } catch(error){
      if (error.response && error.response.data.message === 'User with this E-mail adress already exists') {
          dispatch({
              type: USER_REGISTER_FAIL,
              payload: error.response.data.message
          });
      } else {
          dispatch({
              type: USER_REGISTER_FAIL,
              payload: error.response && error.response.data.message
                  ? error.response.data.data.message
                  : error.message
          });
      }
      console.log(error.response.data.message);
  }
}

export const Logout = ()=>(dispatch) =>{

    localStorage.removeItem('userInfo')
   
    dispatch({
        type:USER_LOGOUT
    })
    
  }

export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, status: response.status, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, status: response.status, message };
  }

  return data;
};

export const getUsers = () => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:5000/api/user/getalluser', {
      method: 'GET',
      headers: {
        accept: 'multipart/form-data',
      },
    });

    const data = await response.json();

    dispatch({ type: GET_USERS_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const approveUser = (id, role) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:5000/api/user/approve/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (response.ok) {
      console.log(`User ${id} approved with role ${role}`);
      dispatch({ type: APPROVE_USER_SUCCESS, payload: { id, role } });
    } else {
      console.log(`Failed to approve user ${id}`);
    }
  } catch (error) {
    console.log(error);
  }
};


export const Forget_Password = (email) => async (dispatch)=>{
  try {
      dispatch({
          type:FORGET_PASSWORD_REQUEST
      })
      const config = {
          headers:{
              'Content-Type' : 'application/json'
          }
      }

      const {data } =await axios.post(
          'http://localhost:5000/api/user/forget-password',
          {email},
          config
      )
              
      dispatch({
          type : FORGET_PASSWORD_SUCCESS,
          payload : data
      })

  } catch(error){
      dispatch({
          type: FORGET_PASSWORD_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
        
        
        
        
  }
}


export const resetPassword = (password,id,token) => async (dispatch)=>{
  try {
      dispatch({
          type:RESET_PASSWORD_REQUEST
      })
      const config = {
          headers:{
              'Content-Type' : 'application/json'
          }
      }

      const {data } =await axios.post(
          `http://localhost:5000/api/user/reset-password?id=${id}&token=${token}`,
          {password},
          config
      )

      dispatch({
          type : RESET_PASSWORD_SUCCESS,
          payload : data
          
      })
  } catch(error){
      dispatch({
          type: RESET_PASSWORD_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })

  }
}

export const blockUser = (id) => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:5000/api/user/block', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    dispatch({ type: USER_BLOCK_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const unblockUser = (id) => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:5000/api/user/unblock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    dispatch({ type: UNBLOCK_USER, payload: data });
  } catch (error) {
    console.log(error);
  }
};



export const verifyEmail = (emailToken) => async (dispatch)=>{
  let messageSuccess ;  
  try {
        dispatch({
            type:USER_VERIFY_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        }

        const { data } = await axios.put(
          `http://localhost:5000/api/user/verify-email/${emailToken}`,
            config
          );

       if( dispatch({
            type : USER_VERIFY_SUCCESS,
            payload : data
        })) { return messageSuccess === "MAil VERIFIED "}
        dispatch ({
            type : USER_VERIFY_SUCCESS,
            payload : data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch(error){
      if (error.response && error.response.data.message === 'User with this E-mail adress already verified') {
          dispatch({
              type: USER_VERIFY_FAIL,
              payload: error.response.data.message
          });
      } else {
          dispatch({
              type: USER_VERIFY_FAIL,
              payload: error.response && error.response.data.message
                  ? error.response.data.data.message
                  : error.message
          });
      }
      console.log(error.response.data.message);
  }
}
export const coachaction = (coach) => async (dispatch)=>{
  try {
      dispatch({
          type:ADD_COACH_REQUEST
      })
      const config = {
          headers:{
              'Content-Type' : 'application/json'
          }
      }
      const {data } =await axios.post(
          `http://localhost:5000/api/user/coach`,
          coach,
          config
      )

      dispatch({
          type : ADD_COACH_SUCCESS,
          payload : data
          
      })
  } catch(error){
      dispatch({
        
          type: ADD_COACH_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })

  }
}


export const sponsoraction = (sponsor) => async (dispatch)=>{
  try {
      dispatch({
          type:ADD_SPONSOR_REQUEST
      })
      const config = {
          headers:{
              'Content-Type' : 'application/json'
          }
      }

      const {data } =await axios.post(
          `http://localhost:5000/api/user/sponsor`,
          sponsor,
          config
      )

      dispatch({
          type : ADD_SPONSOR_SUCCESS,
          payload : data
          
      })
  } catch(error){
      dispatch({
          type: ADD_SPONSOR_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })

  }
}


export const update = ({firstName,lastName,phone,email,cin,imageUrl,password,dateOfBirth,id}) => async (dispatch)=>{
  try {
        dispatch({
            type:UPDATE_USER_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        }

        const { data } = await axios.put(
          `http://localhost:5000/api/user/updateUser/${id}`,
            {firstName,lastName,phone,email,cin,imageUrl,password,dateOfBirth},
            config
          );

        dispatch({
            type : UPDATE_USER_SUCCESS,
            payload : data
        })
     
       // localStorage.setItem('userInfo', JSON.stringify(data))

       } catch(error){
      if (error.response && error.response.data.message === 'User with this E-mail adress already exists') {
          dispatch({
              type: UPDATE_USER_FAIL,
              payload: error.response.data.message
          });
      } else {
          dispatch({
              type: UPDATE_USER_FAIL,
              payload: error.response && error.response.data.message
                  ? error.response.data.data.message
                  : error.message
          });
      }
      console.log(error.response.data.message);
  }
}

export const updateCoch = ({firstName,lastName ,phone, email 
  ,password,cin,imageUrl,dateOfBirth,speciality,descriptionCoach,dateDebutExperience
  ,dateFinExperience,titrePoste,file,id}) => async (dispatch)=>{
  try {
        dispatch({
            type:UPDATE_COACH_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        }

        const { data } = await axios.put(
          `http://localhost:5000/api/user/updateCoach/${id}`,
            {firstName,lastName ,phone, email 
              ,password,cin,imageUrl,dateOfBirth,speciality,descriptionCoach,dateDebutExperience
              ,dateFinExperience,titrePoste,file},
            config
          );

        dispatch({
            type : UPDATE_COACH_SUCCESS,
            payload : data
        })
     
       // localStorage.setItem('userInfo', JSON.stringify(data))

       } catch(error){
      if (error.response && error.response.data.message === 'Coach with this E-mail adress already exists') {
          dispatch({
              type: UPDATE_COACH_FAIL,
              payload: error.response.data.message
          });
      } else {
          dispatch({
              type: UPDATE_COACH_FAIL,
              payload: error.response && error.response.data.message
                  ? error.response.data.data.message
                  : error.message
          });
      }
      console.log(error.response.data.message);
  }
}



export const updateSponsor = ({firstName,lastName ,phone, email ,password,cin,dateOfBirth,imageUrl,
  entrepriseName,sector,descriptionSponsor,fil,id}) => async (dispatch)=>{
  try {
        dispatch({
            type:UPDATE_SPONSOR_REQUEST
        })
        const config = {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        }

        const { data } = await axios.put(
          `http://localhost:5000/api/user/updateSponsor/${id}`,
            {firstName,lastName ,phone, email ,password,cin,dateOfBirth,imageUrl,
              entrepriseName,sector,descriptionSponsor,fil},
            config
          );

        dispatch({
            type : UPDATE_SPONSOR_SUCCESS,
            payload : data
        })
     
       // localStorage.setItem('userInfo', JSON.stringify(data))

       } catch(error){
      if (error.response && error.response.data.message === 'Sponsor with this E-mail adress already exists') {
          dispatch({
              type: UPDATE_SPONSOR_FAIL,
              payload: error.response.data.message
          });
      } else {
          dispatch({
              type: UPDATE_SPONSOR_FAIL,
              payload: error.response && error.response.data.message
                  ? error.response.data.data.message
                  : error.message
          });
      }
      console.log(error.response.data.message);
  }
}