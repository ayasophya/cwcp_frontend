import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { APIBaseUrl } from '../Components/Constants';

const ProductSalesReport = () => {
  const [reportDate, setReportDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchTransactions();
    setReportDate(getFormattedDate(new Date())); 
  }, []);

  const fetchTransactions = () => {
    fetch(`${APIBaseUrl}/transactions`)
      .then(response => response.json())
      .then(transactionsData => {
        setTransactions(transactionsData);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  };

  const fetchProducts = () => {
    fetch(`${APIBaseUrl}/transactions/min-max`)
      .then(response => response.json())
      .then(productsData => {
        setProducts(productsData);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generatePDF = () => {
    const input = document.getElementById('sales-report');
    
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm','a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth/imgWidth, pdfHeight/imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio)/2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG',imgX, imgY, imgWidth * ratio, imgHeight* ratio);
      pdf.save('sales_report.pdf');
    });
  };

  const getFormattedDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (products.length > 0) {
      renderPieChart(products);
    }
  }, [products]);

  const renderPieChart = (products) => {
    const ctx = document.getElementById('pie-chart');
    if (ctx && Chart.getChart(ctx)) {
      Chart.getChart(ctx).destroy(); 
    }
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Least Sold', 'Most Sold'],
        datasets: [{
          label: 'Product Sales',
          data: [products[0].totalQuantitySold, products[1].totalQuantitySold],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Most and Least Sold Products',
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    const meta = chart.getDatasetMeta(0);
                    const ds = data.datasets[0];
                    const arc = meta.data[i];
                    const custom = arc && arc.custom || {};
                    const arcOpts = chart.options.elements.arc;
                    const fill = custom.backgroundColor ? custom.backgroundColor : ds.backgroundColor[i];
                    const stroke = custom.borderColor ? custom.borderColor : ds.borderColor[i];
                    const bw = custom.borderWidth ? custom.borderWidth : ds.borderWidth[i];
                    
                    let productName = '';
                    let amountSold = 0;
                    if (i === 0) {
                      productName = products[0].name;
                      amountSold = products[0].totalQuantitySold;
                    } else if (i === 1) {
                      productName = products[1].name;
                      amountSold = products[1].totalQuantitySold;
                    }
                    
                    return {
                      text: `${productName} - ${amountSold} sold`,
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          }
        }
      }
    });
};


  return (
    <div id="sales-report">
      <div className="report-date">
        <p>Report Date:</p>
        <p>{reportDate}</p>
      </div>
      {transactions.length > 0 ? (
        <SalesReport transactions={transactions} />
      ) : (
        <p>No transactions available</p>
      )}
      <div>
        <canvas id="pie-chart" width="400" height="400"></canvas>
      </div>
      <div className="sales-report-button">
        <button onClick={generatePDF}>Download PDF</button>
      </div>
    </div>
  );
};


const SalesReport = ({ transactions }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
    fetchProducts();
  }, [transactions]);

  const fetchCartItems = () => {
    Promise.all(
      transactions.map(transaction =>
        fetch(`${APIBaseUrl}/transactions/${transaction.transactionId}`)
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
    fetch(`${APIBaseUrl}/categories`)
      .then(response => response.json())
      .then(categoriesData => {
        setCategories(categoriesData);
        const promises = categoriesData.map(category =>
          fetch(`${APIBaseUrl}/categories/${category.inventoryId}/products`)
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

  useEffect(() => {
    const calculatedTaxAmount = totalSalesAmount * 0.15;
    setTaxAmount(calculatedTaxAmount);
  }, [totalSalesAmount]);
  return (
    <div>
      <h2>Sales Report</h2>
      <div className="sales-report-summary">
        <div>
        <strong>Sales Amount (without tax):</strong> ${totalSalesAmount.toFixed(2)}
          <br />
          <strong>Sales Tax (15%):</strong> ${taxAmount.toFixed(2)}
          <br />
          <strong>Sales Total (including tax):</strong> ${(totalSalesAmount + taxAmount).toFixed(2)}
          <br />
          <strong>Total Profit:</strong> ${totalProfit.toFixed(2)}</div>
      </div>
      <table className="sales-report-table">
       
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
          {cartItems && cartItems.map(cartItemData => (
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
