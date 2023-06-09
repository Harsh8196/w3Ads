
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

Currently, this demo is only for showing the limited functionality of the Web3 advertisement system. We show demo ads on the Lenstube platform. In the future, we will incorporate more features into our platform.

**Architecture**

## Overview  
For the guide we will go through the following high-level steps:

1) Base Setup & Config
   - Prerequisites
   - Download & install repo
   - Setup env-env
2) Space & Time Setup 
   - Connect to SxT
   - Create Table
   - Insert Data
3) Connect SxT to Mumbai via Chainlink Functions

## Base Setup & Config 

### Prerequisites
1) You will need beta access to Space and Time and Chainlink Functions. You can request access to [SxT beta here](https://www.spaceandtime.io/access-beta) and [Chainlink functions beta here](https://chainlinkcommunity.typeform.com/requestaccess?typeform-source=docs.chain.link).  

2) If you're new to SxT it's recommended that you start first with our [SxT Getting Started Guide](https://docs.spaceandtime.io/docs/getting-started). If you're new to Chainlink Functions, they recommend you start with their [Getting Started](https://docs.chain.link/chainlink-functions/getting-started/). Having a basic understanding of how to connect to SxT and how Chainlink Functions work will set you up for success with this guide.   

### Setup 
1) `git clone https://github.com/Harsh8196/w3Ads`
2) `Go to each directory and setup each component` 

___

## Demo Video

## Smart Contract Address

