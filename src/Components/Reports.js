import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from './SideBar_admin';

const Reports  = () => {
return (
    <div>
      <header>
        <h1>Admin Page</h1>
      </header>
      <div className="container">
        <Sidebar />
        <div className="content">
          <h2>Reports</h2>
        </div>
      </div>
    </div>
  );
};
export default Reports;