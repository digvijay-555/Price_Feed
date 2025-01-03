import { useEffect, useState } from 'react';
import './App.css';
import abi from "./assets/abi.json";
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask Installed!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account", account);
        setAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
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
      init(); // Initialize the provider and contract after wallet is connected
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      // Ensure ethereum is injected correctly
      console.log("MetaMask is ready, initializing Web3 provider");

      // Initialize Web3Provider after wallet is connected
      const _provider = new ethers.providers.Web3Provider(ethereum);
      const _signer = _provider.getSigner();

      const contractAddress = "0xdC66508c5e1C190be85D712604663B33C2EA3982";
      const contractABI = abi;

      // Log contract initialization steps
      console.log("Initializing contract with address:", contractAddress);
      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);

      // Check contract methods
      console.log("Available contract methods:", Object.keys(_contract.interface.functions));

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);

      // Fetch prices after initializing contract
      fetchPrices(_contract);
    } catch (error) {
      console.error("Error initializing provider or contract:", error);
    }
  };

  const fetchPrices = async (_contract) => {
    try {
      if (!_contract) return;

      // Check if contract is initialized before trying to call methods
      const ethPrice = await _contract.ETH_PRICE();
      const btcPrice = await _contract.BTC_PRICE();
      setEthPrice(ethPrice);
      setBtcPrice(btcPrice);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const handleEthPrice = async () => {
    try {
      if (!contract) {
        alert("Contract not initialized!");
        return;
      }

      const tx = await contract.EthPrice();
      await tx.wait();
      const updatedEthPrice = await contract.ETH_PRICE();
      setEthPrice(updatedEthPrice);
      alert('ETH Price fetched successfully!');
    } catch (err) {
      console.error("Error fetching ETH price:", err);
    }
  };

  const handleBtcPrice = async () => {
    try {
      if (!contract) {
        alert("Contract not initialized!");
        return;
      }

      const tx = await contract.BtcPrice();
      await tx.wait();
      const updatedBtcPrice = await contract.BTC_PRICE();
      setBtcPrice(updatedBtcPrice);
      alert('BTC Price fetched successfully!');
    } catch (err) {
      console.error("Error fetching BTC price:", err);
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
      <div>
        <h1>ETH and BTC Price Feeds</h1>
        <br />
        <br />
        <button onClick={handleEthPrice}>Fetch ETH Price</button>
        <h2>ETH Price : ${ethPrice}</h2>
        <button onClick={handleBtcPrice}>Fetch BTC Price</button>
        <h2>BTC Price : ${btcPrice}</h2>
      </div>
    </>
  );
}

export default App;
