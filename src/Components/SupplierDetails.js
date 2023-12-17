import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from './SideBar_admin';

const SupplierDetails = () => {
  const [supplier, setSupplier] = useState({});
  const { supplierId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/suppliers/${supplierId}`)
      .then(response => response.json())
      .then(data => setSupplier(data))
      .catch(error => console.error('Error fetching supplier details:', error));
  }, [supplierId]);

  return (
    <div>
      <header>
        <h1>Admin Page</h1>
      </header>
      <div className="container">
        <Sidebar />
        <div className="content">
          <h2>Supplier Details</h2>
          <h2>{supplier.name}</h2>

          <Button as={Link} to="/admin/addProduct" className="custom-add-button">
            Add Product
          </Button>
          <div className="supplier-details">
            <table>
              <tbody>
                <tr>
                  <th>Supplier Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Fax Number</th>
                  <th>Website</th>
                </tr>
                <tr>
                  <td>{supplier.name}</td>
                  <td>{supplier.phoneNumber}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.faxNumber}</td>
                  <td>{supplier.website}</td>
                </tr>
              </tbody>
            </table>
            </div>
            <div className="product-supplied-table">
            <h3>Product Supplied Information</h3>
            <table>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Country</th>
                  <th>Cost</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
