import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png';
import logo from './Images/tire_logo.png';
import cart from './Images/shopping_cart.png';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';


const SiteHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(Cookies.get('isAuthenticated')) || false
    })
    useEffect(() => {
        setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
    }, [isAuthenticated])

    useEffect(() => {
        console.log('isAuthenticated: ' + Cookies.get('isAuthenticated'))
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            console.log(
                'isAuthenticated: ' + Boolean(Cookies.get('isAuthenticated'))
            )
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
        console.log('isAuthenticated: ' + isAuthenticated)
    }, [isAuthenticated])

    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
        console.log('userId: ', userId)
    }, [userId])

    useEffect(() => {
        console.log('isAuthenticated: ' + Cookies.get('isAuthenticated'))
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            console.log(
                'isAuthenticated: ' + Boolean(Cookies.get('isAuthenticated'))
            )
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
        console.log('isAuthenticated: ' + isAuthenticated)
    }, [isAuthenticated])

    useEffect(() => {
        console.log("Current userId: " + userId)
    }, [userId]);

    const handleUserInfo = () => {
        if(userId){
            navigate(`/user/accountDetails/${userId}`);
        }
        else{
            window.location.href = "http://localhost:8080/oauth2/authorization/okta";
        }
    };

    const handleShoppingCart = () => {
        navigate(`/user/shopping-cart`);
    };

    useEffect(() => {
        console.log("Currently: " + isAuthenticated)
    }, [isAuthenticated]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        try {
        
            navigate(`/categories/products/search-result/${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
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
                        <img src={pfp} width={50} height={50} alt="Profile picture default icon" onClick={handleUserInfo} />
                        {isAuthenticated ? (
                         <div> <form
                         method={'post'}
                         action={
                             'http://localhost:8080/api/v1/canadawidecarparts/logout'
                         }
                         id="logoutForm"
                     >
                         <button
                             id={'submit'}
                             type={'submit'}
                         >
                             Logout
                         </button>
                     </form></div>) : (
                            <a href="http://localhost:8080/oauth2/authorization/okta">Login</a>
                            
                        )}
                    </div>
                    <div className='col-sm'>
                        <img src={cart} width={75} height={50} alt="Shopping cart default icon" onClick={handleShoppingCart}/>
                    </div>
                </div>
            </div>
      <nav style={{ float: 'clear' }}>
        <a href="/">Home</a> &nbsp;
        <a href="#">Products</a> &nbsp;
        <a href="/Categories">Categories</a> &nbsp;
        <a href="#">Contact</a>
        <form onSubmit={handleSearchSubmit} style={{ display: 'inline-block' }}>
          <input
            type="text"
            placeholder="Search by name or part number"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </nav>
    </div>
  );
};

export default SiteHeader;
