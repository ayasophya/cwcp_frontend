import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Employees = () => {
    const navigate = useNavigate();

    
    return (
      <div className='admin-css'>
        <header className='admin-header'>
          <h1>Admin Page</h1>
        </header>
        <div className="admin-container">
          <Sidebar />
          <div className="content">
            <h2>Employees</h2>
            <Button as={Link} to="/admin/addEmployee" className="custom-add-button" id="addEmployeeBtn"> {/*onClick={() => directToForm()}*/} 
              Add Employee
            </Button>
  
            <div className="supplier-header-row">
            <div className="supplier-header-item">Employee Name</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Employees;