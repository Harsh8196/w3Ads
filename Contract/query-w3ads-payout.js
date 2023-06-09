
const sqlText = args[0]
const resourceId = args[1]

const response = await Functions.makeHttpRequest({
  url: "https://hackathon.spaceandtime.dev/v1/sql/dql",
  method: "POST",
  timeout: 9000,
  headers: {
    'Authorization': `Bearer ${ secrets.accessToken }`,
    "Content-Type": "application/json"
  },
  data: { "resourceId": resourceId, "sqlText": sqlText }
})
const responseData = response.data

console.log("Full response from SxT API:", response)
console.log("Value we'll send on-chain:", responseData[0]);

return Buffer.from(`${responseData[0].EARNINGS*10**18},${responseData[0].ON_ADS},${responseData[0].CONTENT_CREATOR},`);
//return Buffer.from(`00000000000000000,${responseData[0].ON_ADS},${responseData[0].CONTENT_CREATOR},`);