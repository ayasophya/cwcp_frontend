import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';


const UserOrder = () => {
//   const { transactionId } = useParams();

  return (
    <div>
      <SiteHeader />
      <div style={{height: "60vh"}}>
        <h1>Order Successfully placed!</h1>
      </div>

      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default UserOrder;
