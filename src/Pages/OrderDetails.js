import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Components/SideBar_admin';
import { APIBaseUrl, APIDomain } from '../Components/Constants';
import { useAuth } from '../Auth/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const auth = useAuth();
  const [updateStatus, setUpdateStatus] = useState('');
  const [isShipped, setIsShipped] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    courier: '',
    shippingCost: 0,
    trackingNb: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetch(`${APIBaseUrl}/transactions/${orderId}`, { method: "GET",
        headers: {
            "Authorization": `bearer ${auth.getAccessToken()}`
        }
      })
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

  const handleCancelOrder = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (confirmCancel) {
      // Send request to update status
      fetch(`${APIBaseUrl}/transactions/${orderId}/status/CANCELLED`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
          .then(response => {
            if (response.ok) {
              setUpdateStatus('Order successfully cancelled.');
              // Refresh or update order details as needed
            } else {
              setUpdateStatus('Failed to cancel order.');
            }
          })
          .catch(error => {
            console.error('Error updating order status:', error);
            setUpdateStatus('Failed to cancel order.');
          });
    }
  };

  const handleCancel = () => {
    setIsShipped(false);
  }
  const handleShip = () => {
    console.log("inside the fucntions")
    setIsShipped(true)
  }
  const handleConfirmShipping = () => {
      setIsShipped(false);
      fetch(`${APIBaseUrl}/transactions/${orderId}/shipment`, {
        method: 'PUT',
        body: JSON.stringify({
          courier: shippingDetails.courier,
          actualShippingCost: shippingDetails.shippingCost,
          trackingNumber: shippingDetails.trackingNb
      }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        if (response.ok) {
          setUpdateStatus('Order successfully shipped.');
          // Refresh or update order details as needed
        } else {
          setUpdateStatus('Failed to ship order.');
        }
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        setUpdateStatus('Failed to ship order.');
      });
  }

  const isOrderPlaced = order && order.transactionStatus !== 'CANCELLED';
  const isOrderShipped = order && order.transactionStatus === 'SHIPPED';

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
                <p><strong>Order Status:</strong> {order.transactionStatus}</p>
                <div className='button-group'>
                  <button
                      onClick={handleCancelOrder}
                      className={`cancel-order-btn delete-button ${!isOrderPlaced ? 'disabled' : ''}`}
                      disabled={!isOrderPlaced}
                  >
                    Cancel Order
                  </button>
                  <button
                      onClick={handleShip}
                      className={`delete-button ship-order-btn ${isOrderShipped ? 'disabled' : 'enabled'}`}
                      disabled={isOrderShipped}
                  >
                    Ready for shipping
                  </button>
                </div>
                {updateStatus && <p>{updateStatus}</p>}
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
        <Modal show={isShipped}>
            <Modal.Body className="shipping-modal">
                <h3 className='modal-title'>Enter Shipping Details</h3>
                <input 
                type="text"
                name="courier"
                placeholder='Courier Name'
                required={true}
                onChange={handleInputChange}/> <br/>
                <input 
                type="number"
                name="shippingCost"
                placeholder='Actual Shipping Cost'
                required={true}
                onChange={handleInputChange}/> <br/>
                <input 
                type="text"
                name="trackingNb"
                placeholder='#Tracking Number'
                required={true}
                onChange={handleInputChange}/>
                <br/>
                <div className='button-group'>
                  <Button variant="secondary" className="mr-button" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button variant="danger" onClick={handleConfirmShipping}>
                      Confirm Shipping Details
                  </Button>
                </div>
            </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetails;
