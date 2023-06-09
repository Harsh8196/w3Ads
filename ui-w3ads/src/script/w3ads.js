import web3 from './_web3'
import FunctionsConsumerAbi from '../abi/FunctionsConsumer.json'


// const instance = new web3.eth.Contract(onescanVerifyAbi.abi,'0xb2909399F8e04a3f925457dB0456C6ADf5Ba8E10')
// let contractFile = JSON.parse(onescanVerifyAbi)

const instance = new web3.eth.Contract(FunctionsConsumerAbi.abi,'0x7c0Bc53A114CA8e77238C78c3e8155a87b35067E')  
// console.log(instance)

export default instance

