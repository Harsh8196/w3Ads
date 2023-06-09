const {Web3} = require('web3');
const FunctionsConsumerAbi  = require('../abi/FunctionsConsumer.json') 
const { getAuthToken } = require("./authToken");
const at = getAuthToken()

function getHeaders(tableName){
    let authToken = getAuthToken()
    let biscuit
    if(tableName === 'session'){
        biscuit = process.env.BISCUIT_SESSION
    }else if(tableName === 'event') {
        biscuit = process.env.BISCUIT_EVENT
    } else if(tableName === 'ads') {
        biscuit = process.env.BISCUIT_ADS
    }

    const headers = {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization':'Bearer '+authToken,
        'biscuit': biscuit
    }

    return headers
}

let web3;
const providers = new  Web3.providers.HttpProvider("https://polygon-mumbai.infura.io/v3/994c27d587fe42a3a5cb1fd926736201")
web3 = new Web3(providers);

const instance = new web3.eth.Contract(FunctionsConsumerAbi.abi,'0x7c0Bc53A114CA8e77238C78c3e8155a87b35067E')  

function getPaymentStatus(){
    setInterval(async() =>{
        const paidCreator = await instance.methods.latestAdsCreatorPaid().call()
        const paidForAds = await instance.methods.latestAdsPaid().call()
    
        console.log(paidCreator,paidForAds)
        if(paidForAds !== '') {
            try {
                const isAlreadyPaid = await checkIfAlreadyPaid(paidForAds,paidCreator)
                if(!isAlreadyPaid){
                    let db_reply = await fetch(process.env.URL_DML,{
                        method:'POST',
                        headers:getHeaders("event"),
                        body:JSON.stringify({
                            "resourceId": "ADSERVER.events_table_test",
                            "sqlText":"UPDATE ADSERVER.events_table_test set is_paid = '1' where on_ads = '"+paidForAds+"' and content_creator = '"+paidCreator+"'"
                        })
                    })
                    db_reply = await db_reply.json()
                    if(db_reply[0].UPDATED == 1){
                        return db_reply
                    }
                }
            } catch (error) {
                console.log('error',error)
            }
        }
    },60000)
}

async function checkIfAlreadyPaid(adsId,creator) 
{
    try {
        let db_reply = await fetch(process.env.URL_DQL,{
            method:'POST',
            headers:getHeaders("event"),
            body:JSON.stringify({
                "resourceId": "ADSERVER.events_table_test",
                "sqlText":"select * from ADSERVER.events_table_test where on_ads = '"+adsId+"' and content_creator = '"+creator+"' and is_paid = 1"
            })
        })
        db_reply = await db_reply.json()
        if(db_reply.length > 0){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log('error',error)
    }
}

module.exports = {getPaymentStatus}