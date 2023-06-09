
## Introduction 
In this guide, we will walk you through the process of creating Web3 Advertisement system using Space and Time and Chainlink Functions. We will create an advertisement and this advertisement runs on lenstube platform. More specifically, advertisement event data in Space and Time is updated, and fed to the W3Ads contract using Chainlink Functions. 

Before we get started, we should answer a couple of important questions. 

**What is an Advertisement and Why we require?**

Advertisement is necessary for both the business as well as customers. The business would not be able to tell about the products or services available for sale, while customers could not be able to know that what is there in the market and need to compromise their purchase with the products or service available nearby.

**What is the problem in existing web2 advertisement system?**

As we know, The web2 advertisement system is handled in a centralized way. Which minimizes trust between the company, creator, and advertising company. We also don't know how much commission the company earns from advertisements and how much is paid to content creators. So we need a decentralized system to manage the advertisement system.

**What is the solution?**

Blockchain helps us to minimize this problem. We are here to help you out.Web3 Advertisement is a platform to manage advertisements in a decentralized way. We used Space And Time data warehouse to manage advertisement data and Chainlink Function to settle payment to the content creator.

**Note**

Currently, this demo is only for showing the limited functionality of the Web3 advertisement system. We show demo ads on the Lenstube platform. **We added support for vast player in lenstube platform for the Chain Link Hackathon.** In the future, we will incorporate more features into our platform.

**Architecture**
![W3Ads](https://github.com/Harsh8196/w3Ads/assets/35626990/90af9178-1398-42b4-bac6-c88a9c692eca)

## Overview  
In our system we have five key component
1) AdServer - This is used to mange all advertisement details and event.
2) Web App - This is used to create advertisement and show analytics.
3) SxT Data Warehouse - This is used to store all advertisement data and event data coming from ad viewer.
4) Smart Contract - This is used to store all advertisement fund and distribute to content creator
5) Chain Link Functions - This is used to get required data from SxT to smart contract

First, the Company needs to create an advertisement using our Dapp and store funds in smart contracts. As a platform, we take 30% of the overall budget for an advertisement as a platform fee. Once the advertisement is created all the data is available in Space and Time data warehouse. We delivered these ads to the Lenstube platform when the viewer starts the video. All the events related to advertisement are stored in SxT for analytics and payment distribution to the content creator. After the ads are completed we use Chainlink Functions to get data from SxT and distribute payment according to ads impression and click.

## Base Setup & Config 

### Prerequisites
1) You will need beta access to Space and Time and Chainlink Functions. You can request access to [SxT beta here](https://www.spaceandtime.io/access-beta) and [Chainlink functions beta here](https://chainlinkcommunity.typeform.com/requestaccess?typeform-source=docs.chain.link).  

2) If you're new to SxT it's recommended that you start first with our [SxT Getting Started Guide](https://docs.spaceandtime.io/docs/getting-started). If you're new to Chainlink Functions, they recommend you start with their [Getting Started](https://docs.chain.link/chainlink-functions/getting-started/). Having a basic understanding of how to connect to SxT and how Chainlink Functions work will set you up for success with this guide.   

### Setup 
1) `git clone https://github.com/Harsh8196/w3Ads`
2) `Go to each directory and setup each component` 

## Demo Video

## Smart Contract Address
https://mumbai.polygonscan.com/address/0x7c0bc53a114ca8e77238c78c3e8155a87b35067e

