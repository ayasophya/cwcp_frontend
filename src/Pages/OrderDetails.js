import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Components/SideBar_admin';
import { APIBaseUrl } from '../Components/Constants';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${APIBaseUrl}/transactions/${orderId}`)
      .then(response => response.json())
      .then(data => setOrder(data))
      .catch(error => console.error('Error fetching order details:', error));
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const orderTotal = order.cartItems.reduce((total, item) => {
    return total + (item.totalPrice + item.totalPrice * 0.14975);
  }, 0);

  const totalWithShipping = orderTotal + order.shippingCost;

  return (
    <div className='admin-css'>
      <header className='admin-header'>
        <h1>Admin Page</h1>
      </header>
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          <div className="order-details-container">
            <h2>Order Details</h2>
            <div className="order-details-section">
              <div className="order-header">
                <h2>{order.firstName} {order.lastName}</h2>
                <p><strong>Order ID:</strong> {order.transactionId}</p>
              </div>
              <div className="order-contact-info">
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
                <p><strong>Shipping Address:</strong> {order.shippingStreetAddress}, {order.shippingCity}, {order.shippingProvince}, {order.shippingCountry}, {order.shippingPostalCode}</p>
              </div>
            </div>
            <h3>Items Ordered</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total with tax</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map(item => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${(item.totalPrice + item.totalPrice * 0.14975).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Shipping Cost and Total</h3>
            <table className="shipping-table">
              <tbody>
                <tr>
                  <td><strong>Shipping Cost:</strong></td>
                  <td>${order.shippingCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Total:</strong></td>
                  <td>${totalWithShipping.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
