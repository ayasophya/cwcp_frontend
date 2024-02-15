import React, { useState, useEffect } from 'react';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import Sidebar from '../Components/SideBar_admin';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { APIBaseUrl, APIDomain } from '../Components/Constants';
import { useAuth } from '../Auth/AuthService';


const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    fetch(`${APIBaseUrl}/categories`, { method: "GET",
          headers: {
              "Authorization": `bearer ${auth.getAccessToken()}`
          }
      })
      .then((response) => response.json())
      .then((data) => setInventories(data))
      .catch((error) => console.error('Error fetching inventory:', error));
  }, []);

  const handleInventoryClick = (categoryId) => {
    navigate(`/admin/inventory/${categoryId}/products`);
  };

  const InventoryItem = ({ category }) => {
    return (
      <div onClick={() => handleInventoryClick(category.inventoryId)} className="inventory-item inventory-item-link">
        <h3>{category.name}</h3>
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
          <h2>Inventories</h2>
          <Button as={Link} to="/admin/addInventory" className="custom-add-button">
            Add Inventories
          </Button>
          <div className="inventory-header-row">
            <div className="inventory-header-item">Inventory Name</div>
          </div>
          <div className="inventories-list">
            {inventories.map((inventory) => (
              <InventoryItem key={inventory.inventoryId} category={inventory} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
