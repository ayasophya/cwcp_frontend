import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import Button from 'react-bootstrap/Button';

const Sidebar = () => {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <Button as={Link} to="/admin/orders" className="custom-button-admin">
          Orders
        </Button>
        <Button as={Link} to="/admin/inventory" className="custom-button-admin">
          Inventory
        </Button>
        <Button as={Link} to="/admin/suppliers" className="custom-button-admin">
          Suppliers
        </Button>
        <Button as={Link} to="/admin/reports" className="custom-button-admin">
          Report
        </Button>
        <Button as={Link} to="/admin/employees" className="custom-button-admin">
          Employees
        </Button>
    </nav>
  );
};

export default Sidebar;
