import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import '../styles/Contents.css';
import { Button } from 'react-bootstrap';


const AccountDetails = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/cwcp/security/user-info/${userId}`);
        
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='App'> 
    <SiteHeader />
    <h2 className="account-details-title">User Info for {userInfo.name}</h2>

    <div className="content-container">
      <div className="account-details-container">
        {userInfo.picture && (
          <img src={userInfo.picture} alt='User Avatar' className='user-avatar' />
        )}
        <div className="account-details-info">
        <button className="custom-button-black">Edit</button>
          <p>Email: {userInfo.email}</p>
          <p>Full name: {userInfo.name}</p>
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
