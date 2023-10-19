import {
    CHAT_FETCH_REQUEST,
    CHAT_FETCH_SUCCESS,
    CHAT_FETCH_FAIL,
  } from './chatconstant';
  
  export const chatFetchReducer = (state = { chats: [] }, action) => {
    switch (action.type) {
      case CHAT_FETCH_REQUEST:
        return { ...state, loading: true };
      case CHAT_FETCH_SUCCESS:
        return { loading: false, chats: action.payload };
      case CHAT_FETCH_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  