import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/monokai-sublime.min.css';
import pfp from './Images/profile_icon.png'; 

const HomePage = () => {
  
  return (
    <nav>
      <h1> Canada Wide Car Parts</h1>
      <img style={{textAlign: 'right'}} src={pfp} width={100} height={100} alt="Profile picture default icon" />
      <a href="http://localhost:8080/oauth2/authorization/okta">Login</a>
    </nav>
  );
};

export default HomePage;
