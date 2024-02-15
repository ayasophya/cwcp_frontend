import React, { useState, useEffect } from 'react';

const ProductSalesReport = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetch('http://localhost:8080/api/v1/transactions')
      .then(response => response.json())
      .then(transactionsData => {
        setTransactions(transactionsData);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  };

  return (
    <div>
      {transactions.length > 0 ? (
        <SalesReport transactions={transactions} />
      ) : (
        <p>No transactions available</p>
      )}
    </div>
  );
};

const SalesReport = ({ transactions }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
    fetchProducts();
  }, [transactions]);

  const fetchCartItems = () => {
    Promise.all(
      transactions.map(transaction =>
        fetch(`http://localhost:8080/api/v1/transactions/${transaction.transactionId}`)
          .then(response => response.json())
      )
    )
      .then(cartItemsData => {
        setCartItems(cartItemsData);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  };

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/v1/categories')
      .then(response => response.json())
      .then(categoriesData => {
        setCategories(categoriesData);
        const promises = categoriesData.map(category =>
          fetch(`http://localhost:8080/api/v1/categories/${category.inventoryId}/products`)
            .then(response => response.json())
        );
        Promise.all(promises)
          .then(productsData => {
            const allProducts = productsData.flat();
            setProducts(allProducts);
          })
          .catch(error => {
            console.error('Error fetching products for categories:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const getProductAvailableQuantity = productId => {
    const product = products.find(product => product.internalCode === productId);
    return product ? product.availableQuantity : 'N/A';
  };

  const getProductProfit = productId => {
    const product = products.find(product => product.internalCode === productId);
    if (product) {
      const profit = product.price - product.initialPrice;
      return profit;
    }
    return 0;
  };

  useEffect(() => {
    const totalProfit = cartItems.reduce((acc, cartItemData) => {
      const transactionProfit = cartItemData.cartItems.reduce((transAcc, cartItem) => {
        const profit = getProductProfit(cartItem.productId);
        return transAcc + profit;
      }, 0);
      return acc + transactionProfit;
    }, 0);
    setTotalProfit(totalProfit);

    const totalSalesAmount = cartItems.reduce((acc, cartItemData) => {
      const transactionSalesAmount = cartItemData.cartItems.reduce((transAcc, cartItem) => {
        return transAcc + cartItem.totalPrice;
      }, 0);
      return acc + transactionSalesAmount;
    }, 0);
    setTotalSalesAmount(totalSalesAmount);
  }, [cartItems, products]);

  return (
    <div>
      <h2>Sales Report</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Total Sales Amount:</strong> ${totalSalesAmount.toFixed(2)}
          <br/>
          <strong>Total Profit:</strong> ${totalProfit.toFixed(2)}
        </div>
        
      </div>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Placed Date</th>
            <th>Product Name</th>
            <th>Unit Price</th>
            <th>Quantity Sold</th>
            <th>Total Price</th>
            <th>Quantity Left in Inventory</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(cartItemData => (
            cartItemData.cartItems.map(cartItem => (
              <tr key={`${cartItemData.transactionId}-${cartItem.id}`}>
                <td>{cartItemData.transactionId}</td>
                <td>{cartItemData.placedDate}</td>
                <td>{cartItem.name}</td>
                <td>${cartItem.unitPrice.toFixed(2)}</td>
                <td>{cartItem.quantity}</td>
                <td>${cartItem.totalPrice.toFixed(2)}</td>
                <td>{getProductAvailableQuantity(cartItem.productId)}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSalesReport;
