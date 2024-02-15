import React from 'react';
import Sidebar from '../Components/SideBar_admin';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminPage = () => {
  const [categories, setCategories] = React.useState([]);
  const [reportDate, setReportDate] = React.useState('');

  React.useEffect(() => {
    fetchCategories();
    setReportDate(getFormattedDate(new Date())); // Set initial report date
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

  const generatePDF = () => {
    const input = document.getElementById('inventory-report');

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
      pdf.save('inventory_report.pdf');
    });
  };

  const getFormattedDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h2>Inventory Report</h2>
      <button onClick={generatePDF}>Download PDF</button>
      <div id='inventory-report'>
        <p>Report Date: {reportDate}</p>
        {categories.map(category => (
          <div key={category.inventoryId}>
            <h2>Category: {category.name}</h2>
            <canvas id={`categoryChart-${category.inventoryId}`} width="400" height="200"></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
