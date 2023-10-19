import React,{useContext} from 'react'
import {Form ,Button,Container} from 'react-bootstrap'
import { TransactionContext } from '../Context/Transaction';
const Input = () => {
  const { connectWallet,connectedaccount,formdata,sendTransaction,handleChangeIput } = useContext(TransactionContext)
  const handleSubmit=(e)=>{
    const {addresto,amount,message,keyword} =formdata;
    e.preventDefault();
    if(!addresto || !amount || !message || !keyword)return;
    
    sendTransaction();
  }
  
  return (
    <>
    
        <div className='py-5 px-5'>
          {!connectedaccount &&<Button  variant="info" type="submit" onClick={connectWallet}>
            ConnectWallet
          </Button>}
        </div>
    <Form className='py-5 px-5 w-50'>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Send to </Form.Label>
      <Form.Control type="text" name="addresto" onChange={handleChangeIput} placeholder="To" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Amount </Form.Label>
      <Form.Control type="number" name="amount" onChange={handleChangeIput} placeholder="Amount" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Keyword </Form.Label>
      <Form.Control type="text" name="keyword" onChange={handleChangeIput} placeholder="Keyword" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Message </Form.Label>
      <Form.Control  as="textarea" type="text" name="message" onChange={handleChangeIput} placeholder="Message" />
    </Form.Group>
   
    <Button variant="info" onClick={handleSubmit} type="submit">
      Submit
    </Button>
  </Form>
  </>
  )
}

export default Input