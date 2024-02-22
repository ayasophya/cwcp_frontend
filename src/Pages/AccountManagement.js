import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';

const AccountManagement = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(() => Cookies.get('userId'));

 
    useEffect(() => {
        setUserId(Cookies.get('userId'));
    }, []);

    const handleYourAddress = () => {
        navigate(`/user/address/${userId}`);
    };
    const handleViewOrders = () => {
      navigate(`/user/orderHistory/${userId}`);
  };
    const handleLoginAndSecurity = () => {
     
        if (userId) {
            navigate(`/user/accountDetails/${userId}`);
        } else {
         
            console.error('No user ID found, cannot navigate to account details');
          
        }
    };

    return (
        <div className='App'>
  <SiteHeader />
  <div className="account-management-container" style={{height: "60vh"}}>
    <h2>Your Account</h2>
    <div className="account-options">
      <div className="option-group">
        <div className="option-card"  onClick={handleViewOrders}>
          <div className="icon-container">
          </div>
          <div className="option-title">Your Orders</div>
          <div className="option-description">View Orders</div>
        </div>
        <div className="option-card" onClick={handleLoginAndSecurity}>
          <div className="icon-container">
          </div>
          <div className="option-title">Login & Security</div>
          <div className="option-description">Edit username</div>
        </div>
      </div>
      <div className="option-group">
        <div className="option-card" onClick={handleYourAddress}>
          <div className="icon-container">
          </div>
          <div className="option-title">Your Address</div>
          <div className="option-description">Edit addresses for orders</div>
        </div>
        {/* <div className="option-card">
          <div className="icon-container">
          </div>
          <div className="option-title">Payment Options</div>
          <div className="option-description">Edit or add payment options</div>
        </div> */}
      </div>
    </div>
  </div>
  <footer className='footer'>
    <SiteFooter />
  </footer>
</div>

    );
};
export default AccountManagement;
