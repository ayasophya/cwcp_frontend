import React from 'react';
import Sidebar from './Components/SideBar_admin';
import './styles/Contents.css'
import './styles/Sidebar.css'


const AdminPanel = () => {
  return (
    <div className="admin_panel">
      <header>
        <h1>Admin Page</h1>
      </header>
      <div className="container">
        <Sidebar />
        <div className="content">
          <h2>Welcome to the Admin Panel</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

