import React, { useState } from 'react';
import './App.css';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow { }
}

function App() {
  const connectWallet = async () => {
    await window.keplr?.enable("curium-1");
  }
  const onclickHandler = async () => {
    const walletData = await window.keplr?.getKey("curium-1");
    const signer = walletData?.bech32Address as string;
    const signedMsg = await window.keplr?.signArbitrary(
      "curium-1",
      signer,
      "hello world."
    )
    alert(JSON.stringify(signedMsg));
  }
  return (
    <div className="App">
      <div className='App-header'>
        <button onClick={connectWallet}>Connect Wallet</button>
        <button className='' onClick={onclickHandler}>Sign</button>
      </div>
    </div>
  );
}

export default App;
