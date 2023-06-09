let refreshToken = process.env.REFRESH_TOKEN
let accessToken = process.env.ACCESS_TOKEN

function AuthToken() {
    refreshToken = process.env.REFRESH_TOKEN
    accessToken = process.env.ACCESS_TOKEN
    setInterval(async ()=>{
        console.log('refreshToken',refreshToken)
        try{

            let reply = await fetch(process.env.URL_REFRESH,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Accept':'application/json',
                    'Authorization':'Bearer '+process.env.REFRESH_TOKEN,
                }
            })
            reply = await reply.json()
            process.env.REFRESH_TOKEN = reply.refreshToken
            process.env.ACCESS_TOKEN = reply.accessToken
            //console.log('new refreshToken',process.env.REFRESH_TOKEN)
            console.log(reply)

        }catch(error){
            console.log(error)
        }
    },840000)
}

function getAuthToken() {
    //console.log('accessToken ',process.env.ACCESS_TOKEN)
    return process.env.ACCESS_TOKEN
}

module.exports = {AuthToken,getAuthToken}