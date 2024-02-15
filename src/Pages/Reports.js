import React from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { APIDomain } from '../Components/Constants';

const Reports = () => {
  const navigate = useNavigate();
  const handleInventoryReportClick = () => {
    navigate(`/admin/reports/inventoryReport`);
  };
  
  const handleProductSalesReportClick = () => {
    navigate(`/admin/reports/productSales`);

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
          <h2>Reports</h2>
          <div className="button-container">
            <button className="report-button" onClick={handleInventoryReportClick}>Inventory Report</button>
            <button className="report-button" onClick={handleProductSalesReportClick}>Product Sales Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
