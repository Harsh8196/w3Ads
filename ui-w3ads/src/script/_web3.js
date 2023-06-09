const {Web3} = require('web3');

 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3= new Web3(window.web3.currentProvider);
} else {
  const providers = new  Web3.providers.HttpProvider("https://polygon-mumbai.infura.io/v3/994c27d587fe42a3a5cb1fd926736201")
  web3 = new Web3(providers);
}

export default web3
