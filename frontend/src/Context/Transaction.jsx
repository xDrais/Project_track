import React,{ useEffect,useState } from 'react'
import {ContractAddress,ContractAbi } from '../utils/constans'
import { ethers } from "ethers";

export const TransactionContext = React.createContext();

const { ethereum } = window;


const getEtheurmContract = () =>{
  //const provider = new ethers.providers.Web3Provider(ethereum);
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  
  const transactionContract = new ethers.Contract(ContractAddress,ContractAbi,signer);
  console.log({
    provider,
    signer,
    transactionContract
    
  })
  return transactionContract;
}
export const TransactionProvider=({ children })=>{
  const [connectedaccount, setConnectedAccount] = useState(()=> {
    return ''
  })

  const [formdata, setFormData] = useState(()=>{
    return{addresto:"",amount:"",keyword:"",message:""}
  });
  const [loding, setLoding] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

  const handleChangeIput = (e)=>{
    setFormData((prevState) => ({...prevState, [e.target.name]: e.target.value  }));
  }

  const checkIfWalletIsConnected = async ()=>{
    try {
      if (!ethereum){
        return alert('install metamask')
      }
       const account =await ethereum.request({ method:'eth_accounts' });
       if(account.length){
        setConnectedAccount(account[0])
        //getAllTransaction();
       }else{
        console.log("no account found")
       }
       console.log(account)
    } catch (error) {
      console.log(error);
      throw new Error(" no etherum object ")
    }
  }

  const connectWallet = async ()=>{
    try{
      if (!ethereum){
        return alert('install metamask')
      }
      const account =await ethereum.request({ method:'eth_requestAccounts' });
      
      setConnectedAccount(account[0])
    }catch(err){
      console.log(err);
      throw new Error(" no etherum object ")
    }
  }

  const sendTransaction = async ()=>{
    try {
      if (!ethereum){
        return alert('install metamask')
      }
      //get data from form
      const {addresto,amount,message,keyword} =formdata;
      console.log(formdata)
      //const transactionContract=getEtheurmContract();
      const parseAmount = ethers.utils.parseEther(amount);
  
    console.log('formdata')

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(ContractAddress,ContractAbi,signer);
   
       const transactionParameters= {
         //form:   connectedaccount,//'0xdcf84579dd0adab31703277eb68a96c7cf06be69',//
         to:     addresto,//'0x1D4EAf481A0C2215B742544951A36B46d6f5A6D6',//
         //gas:    "0x5208",  //0x5208 hexadecimal to 21000 decimal not ether its Gwei (1Qwei = 0.000021 ETH)
         value:  parseAmount._hex,//  converting the amount to hexadecimal
         
       }
        //await signer.sendTransaction(transactionParameters);
          // const address = "0x1D3224bacB401B6C2E6572C91a590a1361F906dE"
          // let result = ethers.utils.isAddress(address)
          // console.log(result)
      //  await ethereum.request({
      //   method: 'eth_sendTransaction',
      //   params: [transactionParameters],
      // });
      console.log("==>"+parseAmount._hex+"  //  "+parseAmount)
      const transactionHash = await transactionContract.addToBlockChain(addresto,ethers.utils.parseEther(amount),message,keyword);
      setLoding(true);
      console.log(`loding -${transactionHash.hash}`)
      await transactionHash.wait();
      console.log(`success -${transactionHash.hash}`)
      setLoding(false);
      console.log(transactionContract)

      //const t = await transactionContract.getAllTransactions();
      //console.log(t)
      //const transactionCounts = await transactionContract.getTransactionCount();


      // console.log((transactionCounts))
      // console.log(Number(transactionCounts))
      // setTransactionCount(Number(transactionCounts))


    } catch (error) {
      console.log(error);
      throw new Error(" no etherum object ")
    }
  }

  useEffect(()=>{
    checkIfWalletIsConnected();
  },[])
return (
  <TransactionContext.Provider value={({ 
    connectWallet,
    connectedaccount,
    formdata,
    handleChangeIput,
    sendTransaction,
     })}>
    {children}
  </TransactionContext.Provider>
)

}
