import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/suppliers')
    //.then((response) => console.log("RHA: " + response))
      .then((response) => response.json())
      .then((data) => setSuppliers(data))
      .catch((error) => console.error('Error fetching suppliers:', error));
  }, []);

  const handleSupplierClick = (supplierId) => {
    navigate(`/suppliers/${supplierId}`);
  };

  const SupplierItem = ({ supplier }) => {
    return (
      <div onClick={() => handleSupplierClick(supplier.supplierId)} className="supplier-item supplier-item-link">
        <h3>{supplier.name}</h3>
      </div>
    );
  };

  return (
    <div className='admin-css'>
      <header className='admin-header'>
        <h1>Admin Page</h1>
      </header>
      <div className="admin-container">
        <Sidebar />
        <div className="content">
          <h2>Suppliers</h2>
          <Button as={Link} to="/admin/addSupplier" className="custom-add-button">
            Add Supplier
          </Button>

          <div className="supplier-header-row">
          <div className="supplier-header-item">Supplier Name</div>
          </div>

          <div className="suppliers-list">
            {suppliers.map((supplier) => (
              <SupplierItem key={supplier.supplierId} supplier={supplier} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
