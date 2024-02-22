import React, { useState, useEffect } from 'react';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { useNavigate, useParams } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';
import { useAuth } from '../Auth/AuthService';
import { format } from 'date-fns';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const auth = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    fetch(`${APIBaseUrl}/transactions/${userId.replace("|", "%7C")}/transactions`, { 
      method: "GET",
      headers: {
        "Authorization": `bearer ${auth.getAccessToken()}`
      }
    })
    .then(response => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => setTransactions(data))
    .catch(error => console.error('Error fetching transactions:', error));
  }, [auth]);

  const formatDate = (longDate) => {
    const date = new Date(longDate);
    return format(date, 'MMMM do yyyy, h:mm:ss a');
  }

  const handleTransactionClick = (transactionId) => {
    setSelectedTransaction(selectedTransaction === transactionId ? null : transactionId);
  };
  const handleCancelOrder = (transactionId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (confirmCancel) {
      fetch(`${APIBaseUrl}/transactions/${transactionId}/status/CANCELLED`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => {
          if (response.ok) {
            setTransactions(transactions.map(transaction => {
              if (transaction.transactionId === transactionId) {
                return { ...transaction, transactionStatus: 'CANCELLED' };
              }
              return transaction;
            }));
            console.log('Order successfully cancelled.');
          } else {
            console.error('Failed to cancel order.');
          }
        })
        .catch(error => {
          console.error('Error updating order status:', error);
          console.error('Failed to cancel order.');
        });
    }
  };
  const calculateTotalQuantity = (cartItems) => {
    let totalQuantity = 0;
    cartItems.forEach(item => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  };

  const calculateItemsTotal = (cartItems) => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.totalPrice;
    });
    return total;
  };

  return (
    <div className="order-history-container">
      <SiteHeader />
      <div className="order-history-content">
        <div className="order-history-title">
          <h2>Your Order History</h2>
          <p>Your Account / Order History</p>
        </div>
        <div className="order-history-list">
          <div className="transaction-header">
            <div>Order ID</div>
            <div>Date Ordered</div>
            <div>Quantity of Items</div>
            <div>Price</div>
            <div>Status</div>
          </div>
          {transactions && transactions.length > 0? transactions.map((transaction) => (
            <div key={transaction.transactionId} className="transaction-item">
              <div className="transaction-summary" onClick={() => handleTransactionClick(transaction.transactionId)}>
                <div>{transaction.transactionId}</div>
                <div>{formatDate(transaction.placedDate)}</div>
                <div>{calculateTotalQuantity(transaction.cartItems)}</div>
                <div>${transaction.amount.toFixed(2)}</div>
                <div>{transaction.transactionStatus}</div>
                
              </div>
              {selectedTransaction === transaction.transactionId && (
                <div className="transaction-details">
                  <div className="items-ordered">
                    <p><strong>Items Ordered:</strong></p>
                    {transaction.cartItems.map((item) => (
                      <div key={item.itemId} className="cart-item">
                        <img src={item.imgURL} alt={item.name} />
                        <div className="cart-item-details">
                          <p><strong>Name:</strong> {item.name}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Unit Price:</strong> ${item.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <p><strong>Items Total:</strong> ${calculateItemsTotal(transaction.cartItems).toFixed(2)}</p>
                  <p><strong>Tax (15%):</strong> ${(calculateItemsTotal(transaction.cartItems) * 0.15).toFixed(2)}</p>
                  <p><strong>Shipping Cost:</strong> ${transaction.shippingCost.toFixed(2)}</p>
                  <p><strong>Final Total:</strong> ${(transaction.amount + transaction.shippingCost + (calculateItemsTotal(transaction.cartItems) * 0.15)).toFixed(2)}</p>
                  </div>
                  <div className="shipping-details">
                    {transaction.courier && transaction.trackingNumber ? (
                      <>
                        <p><strong>Shipping Details:</strong></p>
                        <p><strong>Courier:</strong> {transaction.courier}</p>
                        <p><strong>Tracking Number:</strong> {transaction.trackingNumber}</p>
                      </>
                    ) : (
                      <p>No shipment details available yet</p>
                      
                    )}
                    {transaction.transactionStatus === 'PLACED' && (
                  <button onClick={() => handleCancelOrder(transaction.transactionId)} className='cancel-btn'>Cancel Order</button>
                )}
                  </div>
                </div>
              )}
            </div>
          )): <p>You don't have any transactions</p> }
        </div>
      </div>
      <footer className="footer">
        <SiteFooter />
      </footer>
    </div>
  );
};

export default OrderHistory;
