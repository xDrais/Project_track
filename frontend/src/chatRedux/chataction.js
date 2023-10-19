import axios from "axios";
import {
    CHAT_FETCH_REQUEST,
    CHAT_FETCH_SUCCESS,
    CHAT_FETCH_FAIL,
  } from './chatconstant';

export const fetchChats = () => async (dispatch, getState) => {
  dispatch({ type: CHAT_FETCH_REQUEST });

  const { user } = getState().auth;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get("http://localhost:5000/chat", config);

    dispatch({
         type: CHAT_FETCH_SUCCESS,
          payload: data
         });
  } catch (error) {
    dispatch({ 
        type: CHAT_FETCH_FAIL, 
        
        payload: error.message });
  }
};
