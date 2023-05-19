import React, { useEffect, useState } from 'react';
import './App.css';
import { Keplr, Window as KeplrWindow, StdSignature } from '@keplr-wallet/types';
import { cosmos, InstallError } from '@cosmostation/extension-client';
import { Cosmos } from '@cosmostation/extension-client';

declare global {
  interface Window extends KeplrWindow { }
}

function App() {
  const [provider, setProvider] = useState<Keplr | Cosmos>()
  const [signature, setSignature] = useState<StdSignature>();
  const [wallet, setWallet] = useState<string>("");

  const submitHandler = (e: any) => {
    e.preventDefault()
    connectWallet(e.target.wallet.value);
    console.log(e.target.wallet.value)
  }
  const connectWallet = async (selectedWallet: string) => {
    if (selectedWallet == "Keplr") {
      await window.keplr?.enable("bluzelle-9");
      if (window.keplr) {
        setProvider(window.keplr);
        setWallet("Keplr")
        alert("Keplr wallet is connected")
      } else {
        alert("please install Keplr wallet")
      }
    } else {
      if ((window as any).cosmostation) {
        const cosmostationProvider = await cosmos();
        if (cosmostationProvider) {
          setProvider(cosmostationProvider);
          setWallet("Cosmostation")
          // cosmostationProvider.addChain({
          //   chainId: "bluzelle-9",
          //   chainName: "Bluzelle",
          //   addressPrefix: "bluzelle",
          //   baseDenom: "ubnt",
          //   displayDenom: "BNT",
          //   restURL: "<REST URL>",
          //   coinType: "483", // optional (default: '118')
          //   decimals: 6, // optional (default: 6)
          //   gasRate: {
          //     // optional (default: { average: '0.025', low: '0.0025', tiny: '0.00025' })
          //     average: "0.2",
          //     low: "0.02",
          //     tiny: "0.002",
          //   },
          //   sendGas: "80000", // optional (default: '100000')
          //   type: "", // optional (default: '')
          // });
          alert("Cosmostation wallet is connected");
        } else {

          alert("please install Cosmostation wallet")
        }

      }
    }
  }

  const getAddress = async () => {
    if (wallet == "Keplr") {
      return (await (provider as Keplr).getKey("bluzelle-9")).bech32Address;
    } else {

      return (await (provider as Cosmos).getAccount("bluzelle-9")).address;
    }
  }

  const getSignFunction = () => {
    if (wallet == "Keplr") {
      return (provider as Keplr).signArbitrary;
    } else {
      return (provider as Cosmos).signMessage;
    }
  }


  const getVerifyFunction = () => {
    if (wallet == "Keplr") {
      return (provider as Keplr).verifyArbitrary;
    } else {
      return (provider as Cosmos).verifyMessage;
    }
  }

  const signHandler = async () => {
    if (provider) {
      const signerAddress = await getAddress();
      const signFunction = getSignFunction();
      try {
        const signedMsg = await signFunction(
          "bluzelle-9",
          signerAddress,
          "hello world."
        )
        setSignature(signedMsg);
        alert(JSON.stringify(signedMsg));
      } catch (e) {
        alert(e)
      };
    }
    else {
      alert("wallet not connected")
    }
  }

  const verifyHandler = async () => {
    if (provider && signature) {
      const signerAddress = await getAddress();
      const verifyFunction = getVerifyFunction();
      const result = await verifyFunction(
        "bluzelle-9",
        signerAddress,
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
      alert("wallet not connected or signature is not performed")
    }
  }

  return (
    <div className="App">
      <div className='App-header'>
        <form onSubmit={submitHandler}>
          <input type="radio" id="html" name="wallet" value="Keplr" defaultChecked />
          <label htmlFor="html">Keplr</label>
          <input type="radio" id="css" name="wallet" value="Cosmostation" />
          <label htmlFor="css">Cosmostation</label>
          <br></br>
          <button>Connect Wallet</button>
        </form>
        <br />
        <button onClick={signHandler}>Sign</button>
        <button onClick={verifyHandler}>Verify</button>
      </div>
    </div>
  );
}

export default App;
