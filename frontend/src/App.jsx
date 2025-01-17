import { useEffect, useState } from "react";
import "./App.css";
import abi from "./assets/abi.json";
import { ethers } from "ethers";

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
        console.log("MetaMask is not installed!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        console.log("Authorized account found:", accounts[0]);
        init();
      } else {``
        console.log("No authorized account found.");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask is required to use this app.");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      console.log("Wallet connected:", accounts[0]);
      init();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const init = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask is not available. Please install it.");
        return;
      }

      const _provider = new ethers.providers.Web3Provider(ethereum);
      const _signer = _provider.getSigner();

      const contractAddress = "0xdC66508c5e1C190be85D712604663B33C2EA3982";
      const contractABI = abi.abi;

      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);

      console.log("Contract initialized:", _contract);
      fetchPrices(_contract);
    } catch (error) {
      console.error("Error initializing provider or contract:", error);
    }
  };

  const fetchPrices = async (_contract) => {
    try {
      if (!_contract) {
        console.error("Contract is not initialized.");
        return;
      }

      const ethPrice = await _contract.ETH_PRICE();
      const btcPrice = await _contract.BTC_PRICE();
      setEthPrice(ethers.utils.formatUnits(ethPrice, "ether"));
      setBtcPrice(ethers.utils.formatUnits(btcPrice, "ether"));
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
      setEthPrice(ethers.utils.formatUnits(updatedEthPrice, "ether"));
      alert("ETH Price fetched successfully!");
    } catch (error) {
      console.error("Error fetching ETH price:", error);
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
      setBtcPrice(ethers.utils.formatUnits(updatedBtcPrice, "ether"));
      alert("BTC Price fetched successfully!");
    } catch (error) {
      console.error("Error fetching BTC price:", error);
    }
  };

  return (
    <div>
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
        <button onClick={handleEthPrice}>Fetch ETH Price</button>
        <h2>ETH Price: ${ethPrice}</h2>
        <button onClick={handleBtcPrice}>Fetch BTC Price</button>
        <h2>BTC Price: ${btcPrice}</h2>
      </div>
    </div>
  );
}

export default App;
