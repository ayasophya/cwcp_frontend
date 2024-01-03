import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';

const InventoryList  = () => {
return (
    <div className='admin-css'>
      <header className='admin-header'>
        <h1>Admin Page</h1>
      </header>
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          <h2>Inventories</h2>
        </div>
      </div>
    </div>
  );
};
export default InventoryList;