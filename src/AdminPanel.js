import React from 'react';
import Sidebar from './Components/SideBar_admin';

const AdminPanel = () => {
  return (
    <div className="admin_panel">
      <header>
        <h1>Admin Page</h1>
      </header>
      <Sidebar />
    </div>
  );
};

export default AdminPanel;

