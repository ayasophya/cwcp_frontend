import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';
import { APIBaseUrl } from '../Components/Constants';

const InventoryDetails = () => {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch(`${APIBaseUrl}/categories/${categoryId}`)
        .then(response => response.json())
        .then(data => setCategoryName(data.name))
        .catch(error => console.error('Error fetching category details:', error));
  
      fetch(`${APIBaseUrl}/categories/${categoryId}/products`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }, [categoryId]);

    const handleRowClick = (internalCode) => {
        navigate(`/admin/categories/${categoryId}/products/${internalCode}`); // Updated to use navigate
    };
  
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
                      <tr key={product.id} onClick={() => handleRowClick(product.internalCode)}
                          className="table-row-hover" style={{ cursor: 'pointer' }}>
                          <td>{product.internalCode}</td>
                          <td>{product.inventoryQuantity}</td>
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
  