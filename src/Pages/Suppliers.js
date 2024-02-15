import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { APIBaseUrl, APIDomain } from '../Components/Constants';
import { AuthContext } from 'react-admin';
import Cookies from 'js-cookie'
import { useAuth } from '../Auth/AuthService';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth();
  
  useEffect(() => {
    fetch(`${APIBaseUrl}/suppliers`, { method: "GET",
          headers: {
              "Authorization": `bearer ${auth.getAccessToken()}`
          }
      })
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
