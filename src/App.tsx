import React, { useState } from 'react';
import './App.css';
import { Keplr, Window as KeplrWindow, StdSignature } from '@keplr-wallet/types';
declare global {
  interface Window extends KeplrWindow { }
}

function App() {
  const [provider, setProvider] = useState<Keplr>()
  const [signature, setSignature] = useState<StdSignature>();
  const connectWallet = async () => {
    await window.keplr?.enable("curium-1");
    if (window.keplr) {
      setProvider(window.keplr);
      alert("wallet is connected")
    }
  }
  const signHandler = async () => {
    if (provider) {
      const signer = await provider.getKey("curium-1");
      const signedMsg = await provider.signArbitrary(
        "curium-9",
        signer.bech32Address,
        "hello world."
      )
      setSignature(signedMsg);
      alert(JSON.stringify(signedMsg));
    }
    else {
      alert("wallet not connected")
    }
  }

  const verifyHandler = async () => {
    if (provider && signature) {
      const signer = (await provider.getKey("curium-1"));
      console.log(signer)
      const result = await provider.verifyArbitrary(
        "curium-9",
        signer.bech32Address,
        "hello world.",
        signature
      )
      if (result) {
        alert("verified!");
      }
      else {
        alert("incorrect signer")
      }
    }
    else {
      alert("wallet not connected")
    }
  }

  return (
    <div className="App">
      <div className='App-header'>
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={signHandler}>Sign</button>
        <button onClick={verifyHandler}>Verify</button>
      </div>
    </div>
  );
}

export default App;
