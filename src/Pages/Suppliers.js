import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';
import { AuthContext } from 'react-admin';
import Cookies from 'js-cookie'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  
  const [csrfToken, setCsrfToken] = useState(() => {
    return (
        document.cookie.replace(
            /(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/,
            '$1'
        ) || 'invalid'
    )
})
  const getXsrfToken = () => {
    return csrfToken
}
useEffect(() => {
  console.log('XSRF-TOKEN: ' + Cookies.get('XSRF-TOKEN'))
  setCsrfToken(
      document.cookie.replace(
          /(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/,
          '$1'
      )
  )
}, [csrfToken])

  useEffect(() => {
    fetch(`${APIBaseUrl}/suppliers`, { 
      method: 'get', 
      headers: new Headers({
        "X-XSRF-TOKEN": "UgpU3kYYnccrDehAmgOYNpwB-cl1qGNnhVtFFN_zdh5A25X8Yjsx5yIgrPQGOYl2ri6sV_401PFAylNKtmN0d-_CRntw4vGf"
      })})
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
