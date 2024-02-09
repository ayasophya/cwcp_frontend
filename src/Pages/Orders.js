import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';
import { APIBaseUrl } from '../Components/Constants';
import { format } from 'date-fns';

const OrdersList  = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${APIBaseUrl}/transactions`)
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

  return (
      <div className='admin-css'>
        <header className='admin-header'>
          <h1>Admin Page</h1>
        </header>
        <div className="admin-container">
          <Sidebar />
          <div className="content">
            <h2>Customer's Orders</h2>
            {orders &&
              <div className="supplier-details">
              <table>
                <tbody>
                  <tr>
                    <th>Order Id</th>
                    <th>Customer's name</th>
                    <th>Order Date</th>
                    <th>Order Status</th>
                    {/* <th>Website</th> */}
                  </tr>
                  {orders.map((order) => (
                    <tr>
                      <td>{order.transactionId}</td>
                      <td>{order.firstName + " " + order.lastName}</td>
                      <td>{formatDate(order.placedDate)}</td>
                      <td>{order.transactionStatus}</td>
                      {/* <td>{supplier.website}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
          </div>
        </div>
      </div>
    );
  };
export default OrdersList;