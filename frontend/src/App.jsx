import { useEffect, useState } from 'react'
import './App.css'
import abi from "./assets/abi.json";
import {ethers} from 'ethers';
import { use } from 'react';

function App() {

  const [account, setAccount] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("Make sure you have MetaMask Installed !");
        return;
      }
      else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts"});

      if (accounts.length!==0){
        const account = accounts[0];
        console.log("Found an authorized account", account);
        setAccount(account);
      }
      else{
        console.log("No authorized account found");
      }

    }
    catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div>
      <h1>Connect to MetaMask</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
    </div>
      
    </>
  )
}

export default App
