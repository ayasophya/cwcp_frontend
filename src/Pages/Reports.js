import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';
import { APIDomain } from '../Components/Constants';

const Reports  = () => {
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
        </div>
      </div>
    </div>
  );
};
export default Reports;