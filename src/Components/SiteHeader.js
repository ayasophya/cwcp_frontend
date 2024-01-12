import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png';
import logo from './Images/tire_logo.png';
import React, { useState, useEffect } from 'react';
import { CarDetails } from './Constants';
import { Navigate, useNavigate } from 'react-router-dom';

const SiteHeader = () => {
  const [isLoggedIn, setLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleLogin = () => {
    setLogin((prevState) => !prevState);
  };

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

  return (
    <div className="header">
      <div className="container">
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-1" style={{ textAlign: 'right' }}>
            <img src={logo} alt="logo" width={50} height={50} />
          </div>
          <div className="col-sm-8">
            <h1> CANADA WIDE CAR PARTS</h1>
          </div>
          <div className="col-sm">
            <img src={pfp} width={50} height={50} alt="Profile picture default icon" />
            {isLoggedIn ? (
              <a href="#" onClick={toggleLogin}>
                Login
              </a>
            ) : (
              <a href="http://localhost:8080/oauth2/authorization/okta" onClick={toggleLogin}>
                Logout
              </a>
            )}
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
