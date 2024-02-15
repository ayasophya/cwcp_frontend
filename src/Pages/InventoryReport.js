import React from 'react';
import Sidebar from '../Components/SideBar_admin';
import Chart from 'chart.js/auto';

const AdminPage = () => {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('http://localhost:8080/api/v1/categories')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCategories(data);
        data.forEach(category => {
          fetchCategoryData(category.inventoryId);
        });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const fetchCategoryData = (categoryId) => {
    fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        generateChart(data, categoryId);
      })
      .catch(error => {
        console.error('Error fetching data for category:', error);
      });
  };

  let categoryCharts = {}; 
  const generateChart = (data, categoryId) => {
    const ctx = document.getElementById(`categoryChart-${categoryId}`);

    if (categoryCharts[categoryId]) {
      categoryCharts[categoryId].destroy();
    }

    categoryCharts[categoryId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.name),
        datasets: [{
          label: 'Available Quantity',
          data: data.map(item => item.availableQuantity),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }, {
          label: 'Inventory Quantity',
          data: data.map(item => item.inventoryQuantity),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className='admin-css'>
      <header className='admin-header'>
        <h1>Admin Page</h1>
      </header>
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          <h2>Reports</h2>
          <div>
            {categories.map(category => (
              <div key={category.inventoryId}>
                <h2>Category: {category.name}</h2>
                <canvas id={`categoryChart-${category.inventoryId}`} width="400" height="200"></canvas>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
