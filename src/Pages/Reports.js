import React from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const handleInventoryReportClick = () => {
    navigate(`/admin/reports/inventoryReport`);
  };
  
  const handleProductSalesReportClick = () => {
    navigate(`/admin/reports/productSales`);

  };
  
  const handleWebsiteSalesReportClick = () => {
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
            <button onClick={() => handleInventoryReportClick()}>Inventory Report</button>
            <button onClick={() => handleProductSalesReportClick()}>Product Sales Report</button>
            <button onClick={() => handleWebsiteSalesReportClick()}>Website Sales Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
