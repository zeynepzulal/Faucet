
import './App.css';
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import FaucetAbi from "./abis/Faucet.json";
import Swal from "sweetalert2";


const faucetContractAddr = "0x3e062A6446d8ede9ec334FF0C1673222EC63f97E";

function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");




  useEffect(() => {
    connectWallet();
  }, [walletAddress])

  const connectWallet = async () => {
    if (typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts");

        setProvider(provider)
        setWalletAddress(accounts);

      } catch (err) {
        console.log(err);

      }
    }
  }

  const getTokens = async () => {


    try {

      const contract = new ethers.Contract(faucetContractAddr, FaucetAbi, provider.getSigner());

      const transaction = await contract.requestToken();

      console.log(contract);
      console.log(transaction)

      if (transaction.hash) {
        Swal.fire({
          title: 'Success!',
          html:
            `Check your transaction hash : 
            <a href="https://sepolia.etherscan.io/tx/${transaction.hash} target = "_blank/> Etherscan </a>`,
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
      

    } catch (err) {
      console.log(err);
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }




  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">My Token (MTK) Faucet</h1>
          </div>
          <div id="navbar-menu" className="navbar-menu">
            <div className="navbar-end">
              <button className="button is-white connect-wallet" onClick={connectWallet}>
                {walletAddress ? `Connected to ${walletAddress} ` : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className='faucet-hero-body'>
          <div className='box'>
            <input
              type="text"
              className='input'
              placeholder='enter your wallet address (0x....)'
              defaultValue={walletAddress}
            />
            <button className='button' onClick={getTokens}>Get Tokens</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
