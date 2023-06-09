## Environment Variable

### Now, we'll use env-enc set to set some envars:

`MUMBAI_RPC_URL` - RPC_URL for Mumbai network (Infura or Alchemy)

`PRIVATE_KEY` - Private key for the account/address you used to sign up for Chainlink Functions

`ACCESS_TOKEN` - Space and Time Access Token (only valid for 30 minutes)

`POLYGONSCAN_API_KEY` - Used to verify contracts

`GITHUB_API_TOKEN` - Personal access token, used by Chainlink Functions

### Visit https://github.com/settings/tokens?type=beta and
1) click "Generate new token"
2) Name the token and enable read & write access for Gists from the "Account permissions" drop-down menu.
3) Do not enable any additional permissions.
4) Click "Generate token" and copy the resulting personal access token

## Contract Address

https://mumbai.polygonscan.com/address/0x7c0bc53a114ca8e77238c78c3e8155a87b35067e

## Connect SxT to Mumbai via Chainlink Functions 

We have our tables in SxT. The following steps were adapted from the [Chainlink Functions repo here](https://github.com/smartcontractkit/functions-hardhat-starter-kit) and might be useful as a resource if you run into any issues getting Chainlink Functions setup. 

The first thing we're going to do is simulate the full interaction. This is helpful because it allows us to identify a lot of potential issues before we deploy our dNFT contract. 

1) Test/Simulate

   `npx hardhat functions-simulate --gaslimit 300000`

2) Then we can deploy our contract to mumbai

   `npx hardhat functions-deploy-client --network mumbai --verify true`

3) Get the contract address from the previous step and set temporary envar: 

   `export CONTRACT_ADDRESS=<your_contract_address>`

4) Create CL Functions Subscription and fund with link tokens

   `npx hardhat functions-sub-create --network mumbai --amount 2 --contract $CONTRACT_ADDRESS`

Get the subscription id and set an envar SUB_ID

5) Run request:

   `npx hardhat functions-request --network mumbai --contract $CONTRACT_ADDRESS --subid $SUB_ID --gaslimit 300000`

> 📘  
> If the request fails, Double check your ACCESS_TOKEN. You need to refresh or generate a new ACCESS_TOKEN every 30 min. 


