import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import Button from 'react-bootstrap/Button';

const Sidebar = () => {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <Button as={Link} to="/admin/orders" className="custom-button">
          Orders
        </Button>
        <Button as={Link} to="/admin/inventory" className="custom-button">
          Inventory
        </Button>
        <Button as={Link} to="/admin/suppliers" className="custom-button">
          Suppliers
        </Button>
        <Button as={Link} to="/admin/report" className="custom-button">
          Report
        </Button>
    </nav>
  );
};

export default Sidebar;
