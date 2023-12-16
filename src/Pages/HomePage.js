import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/monokai-sublime.min.css';
import SiteHeader from '../Components/SiteHeader';
import pfp from './../Components/Images/profile_icon.png'; 
import SiteFooter from '../Components/SiteFooter';

const HomePage = () => {
  
  return (
    <div>
      <header>
        <SiteHeader/>
      </header>
      <main class="diagonal-split-background">
        <h1><bold>Welcome to Canada Wide Car Parts </bold></h1>
        <h2>Need A Car Part? <br/>
            Get Them Here 
        </h2>
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <button class="browse-button">Browse Our Products</button>
            </div>
            <div class="col-sm">
              <a href="/Categories" class="browse-button-link">Browse By Category</a>
            </div>
          </div>
        </div>
      </main>
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default HomePage;
