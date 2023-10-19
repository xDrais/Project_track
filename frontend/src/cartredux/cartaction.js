import axios from 'axios'
import { CART_ADD_ITEM, CART_SET_ITEMS, CART_REMOVE_ITEM,CART_SAVE_SHIPPING_ADDRESS ,CART_SAVE_PAYMENT_METHOD } from './cartconstant'
 export const addToCart = (id,qty) =>async(dispatch,getState)=>
 {
    const {data}= await axios.get(`http://localhost:5000/product/${id}`)
    const user = getState().userLogin.userInfo._id;
    const cartItems = JSON.parse(localStorage.getItem(`cartItems_${user}`)) || [];

    const existingItemIndex = cartItems.findIndex((item) => item.product === data._id);
    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update the quantity of the item
      cartItems[existingItemIndex].qty = qty;
      const { data: updatedProduct } = await axios.get(`http://localhost:5000/product/${cartItems[existingItemIndex].product}`);
      cartItems[existingItemIndex].countInStock = updatedProduct.countInStock;
    } else {
      // If the item does not exist in the cart, add it to the cart
      cartItems.push({
        product: data._id,
        productName: data.productName,
        imageProduct: data.imageProduct,
        price: data.price,
        countInStock: data.countInStock,
        qty,
        user,
      });
    }
   
    dispatch({
        type: CART_SET_ITEMS,
        payload: cartItems.filter((item) => item.qty > 0), // Filter out any items with zero quantity
      });
    
      localStorage.setItem(`cartItems_${user}`, JSON.stringify(cartItems)); // Store the updated cart items back to the localStorage
      window.addEventListener('beforeunload', () => {
        const user = getState().userLogin.userInfo._id
        const cartItems = getState().cart.cartItems.filter((item) => item.user === user)
        localStorage.setItem(`cartItems_${user}`, JSON.stringify(cartItems))
      })
}


export const removeFromCart = (id) => ( dispatch , getState) =>{
  const user = getState().userLogin.userInfo._id;
  const cartItems = JSON.parse(localStorage.getItem(`cartItems_${user}`)) || [];
  dispatch({
     type : CART_REMOVE_ITEM ,
     payload : id
  })
  localStorage.setItem(`cartItems_${user}`, JSON.stringify(cartItems)); // Store the updated cart items back to the localStorage
  window.addEventListener('beforeunload', () => {
    const user = getState().userLogin.userInfo._id
    const cartItems = getState().cart.cartItems.filter((item) => item.user === user)
    localStorage.setItem(`cartItems_${user}`, JSON.stringify(cartItems))
  })
}


//saveShippingAdresse
export const saveShippingAdress = (data) =>(dispatch)=>{
  dispatch( {
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload : data
  })
  localStorage.setItem('shippingAddress' , JSON.stringify(data))
}

//savePaymentMethod
export const savePaymentMethod = (data) =>(dispatch)=>{
  dispatch( {
    type: CART_SAVE_PAYMENT_METHOD,
    payload : data
  })
  localStorage.setItem('paymentMethod' , JSON.stringify(data))
}