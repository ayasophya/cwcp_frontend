import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png'; 
import logo from './Images/tire_logo.png';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';

const SiteHeader = () =>{
    const [isLoggedIn, setLogin] = useState(false);

    useEffect(() => {
        console.log("Currently: " + isLoggedIn);
    }, [isLoggedIn]);

    const toggleLogin = () => {
        setLogin(prevState => !prevState)
    };

    return(
        <div class="header">
            <div class="container">
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-1" style={{textAlign: "right"}}>
                        <img src={logo} alt="logo" width={50} height={50}/>
                    </div>
                    <div class="col-sm-8">
                        <h1> CANADA WIDE CAR PARTS</h1>
                    </div>
                    <div class="col-sm">
                        <img src={pfp} width={50} height={50} alt="Profile picture default icon" />
                        {isLoggedIn ? (
                         <a href="#" onClick={toggleLogin}>Login</a>) : (
                            <a href="http://localhost:8080/oauth2/authorization/okta" onClick={toggleLogin}>Logout</a>
                            
                        )}
                        {/* {isLoggedIn ? 
                            <Login onClick={state => setViewPage(state)} /> : 
                            <Logout onClick={state => setViewPage(state)} />} */}
                    </div>
                </div>
            </div>
            <nav style={{float: 'clear'}}>
                <a href="/">Home</a> &nbsp;
                <a href="#">Products</a> &nbsp;
                <a href="/Categories">Categories</a> &nbsp;
                <a href="#">Contact</a>
            </nav>
        </div>
    );
}

export default SiteHeader;