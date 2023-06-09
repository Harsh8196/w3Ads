import React, { useEffect } from 'react'
import Base from './Base'
import Advertisement from '../Advertisement.jpg'
import '../css/Home.css'


function Home() {


    return (
        <Base>
            <div className="HomeContainer">
                <div className="row mt-3 align-items-center">
                    <div className='col-6'>
                        <h1>Web3 Advertisement for company and content creator</h1>
                        <br />
                        <p>
                        Advertisement is necessary for both the business as well as customers. The business would not be able to tell about the products or services available for sale, while customers could not be able to know that what is there in the market and need to compromise their purchase with the products or service available nearby.
                        </p>
                    </div>
                    <div className='col-6'>
                        <img
                            src={Advertisement} />
                    </div>
                </div>
                <div className="row mt-3 align-items-center">
                    <h1>The Problem</h1>
                    <p>
                    As we know, In the web2 advertisement system is handled in a centralized way. Which minimizes trust between the company, creator, and advertising company. We also don't know how much commission the company earns from advertisements and how much is paid to content creators. So we need a decentralized system to manage the advertisement system. 
                    </p>
                </div>
                <div className="row mt-3 align-items-center">
                    <h1>The Solution</h1>
                    <div>
                        <p>
                            Blockchain helps us to minimize this problem.
                            We are here to help you out.Web3 Advertisement is a platform to manage advertisements in a decentralized way. We used Space And Time data warehouse to manage advertisement data and Chainlink Function to settle payment to the content creator.

                        </p>
                        <br/>
                        <p className="fw bold">
                            Note: Currently, this demo is only for showing the limited functionality of the Web3 advertisement system. We show demo ads on the Lenstube platform.
                            In the future, we will incorporate more features into our platform.
                        </p>
                    </div>
                </div>
            </div>
        </Base>
    )
}

export default Home