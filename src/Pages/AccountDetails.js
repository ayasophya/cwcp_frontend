import React, { useState, useEffect } from 'react';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import '../styles/Contents.css';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AccountDetails = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/cwcp/security/user-info/auth0%7C${userId.slice(6)}`);
        
        if (!response.ok) {
          throw new Error('Error fetching user');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/cwcp/security/deleteAccount/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error deleting account');
      }

      console.log("Account successfully deleted");

      // Clear authentication cookies
      Cookies.remove('isAuthenticated');
      Cookies.remove('userId'); // or any other cookie you use for authentication

      // Redirect to home page
      navigate('/'); // assuming '/' is your home route
    } catch (error) {
      setError(error);
      console.error("Error deleting account: ", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='App'> 
    <SiteHeader />
    <div className ="account-details-title">
    <h2>Account Details for {userInfo.name}</h2>
<p>Your Account    /    Login & Security</p>
</div>
    <div className="content-container">
      <div className="account-details-container">
        {userInfo.picture && (
          <img src={userInfo.picture} alt='User Avatar' className='user-avatar' />
        )}
        <div className="account-details-info">
          <p>Email: {userInfo.email}</p>
          <p>Full name: {userInfo.name}</p>
          <button className="custom-button-black">Edit</button>
        <button className="custom-button-black" onClick={handleDelete}>Delete Account</button>
</div>
      </div>
    </div>
    <footer class="footer">
        <SiteFooter/>
      </footer>
  </div>
);
        };

export default AccountDetails;
