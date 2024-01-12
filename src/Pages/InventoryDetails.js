import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';

const InventoryDetails = () => {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
  
    useEffect(() => {
      fetch(`http://localhost:8080/api/v1/categories/${categoryId}`)
        .then(response => response.json())
        .then(data => setCategoryName(data.name))
        .catch(error => console.error('Error fetching category details:', error));
  
      fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }, [categoryId]);
  
    return (
      <div className='admin-css'>
        <header className='admin-header'>
          <h1>Admin Page</h1>
        </header>
        <div className="admin-container">
          <Sidebar />
          <div className="content">
            <h2>Products in {categoryName}</h2>
            <Button as={Link} to="/admin/addProduct" className="custom-add-button">
              Add Product
            </Button>
            <div className="inventory-details">
              <table>
                <thead>
                  <tr>
                    <th>Item Number</th>
                    <th>Inventory Quantity</th>
                    <th>Available Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.internalCode}</td>
                      <td>{product.inventoryQuantity}</td> {/* Note the camelCase */}
                      <td>{product.availableQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default InventoryDetails;
  