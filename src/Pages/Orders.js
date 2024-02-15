import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { APIBaseUrl, APIDomain } from '../Components/Constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthService';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    fetch(`${APIBaseUrl}/transactions`, { method: "GET",
        headers: {
            "Authorization": `bearer ${auth.getAccessToken()}`
        }
      })
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching supplier details:', error));
  }, []);

  const formatDate = (longDate) => {
    let date = longDate.split('T')[0];
    date = date.split('-');
    let time = longDate.split('T')[1];
    time = time.split('.')[0];
    time = time.split(':');
    console.log(date)

    let datetime = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2], 0);
    datetime.setHours(datetime.getHours() - 5);
    const final = format(datetime, 'MMMM do yyyy, h:mm:ss a')
    // const fullTime = date + " " + time;
    console.log(final)
    return final;
  }

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);

  };

  const OrderItem = ({ order }) => {
    return (
      <tr onClick={() => handleOrderClick(order.transactionId)} className="inventory-item inventory-item-link">
        <td>{order.transactionId}</td>
        <td>{order.firstName + " " + order.lastName}</td>
        <td>{formatDate(order.placedDate)}</td>
        <td>{order.transactionStatus}</td>
      </tr>
    );
  };

  return (
    <div className='admin-css'>
      <header className='admin-header'>
          <h1>Admin Page</h1>
          <div> <form
              method={'post'}
              action={
                  `${APIDomain}/api/v1/canadawidecarparts/logout`
              }
              id="logoutForm">
              <button
                  id={'submit'}
                  type={'submit'}>
                  Logout
              </button>
          </form></div>
        </header>
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          <h2>Customer's Orders</h2>
          <div className="supplier-details">
            <table>
              <tbody>
                <tr>
                  <th>Order Id</th>
                  <th>Customer's name</th>
                  <th>Order Date</th>
                  <th>Order Status</th>
                </tr>
                {orders.map((order) => (
                  <OrderItem key={order.transactionId} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
