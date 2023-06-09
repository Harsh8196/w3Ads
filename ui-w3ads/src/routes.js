import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './component/Home';
import Company from './component/Company';




function AllRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' exact element={<Home/>}/>
                <Route path='/company' element={<Company/>}/>
                {/* <Route path='/claim/:contractAddress/:tokenId'>
                    <Claim/>
                </Route>
                <Route path='/issuer'>
                    <Issuer/>
                </Route>
                <Route path='/createContract/:index'>
                    <CreateContract/>
                </Route> */}
            </Routes>
        </BrowserRouter>
    )
}

export default AllRoutes