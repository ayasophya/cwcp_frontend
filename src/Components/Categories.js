import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import brake from './Images/category_brake.png'; 
import suspension from './Images/category_suspension.png'; 


const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleProductsList = (categoryId) => {
    navigate(`/categories/${categoryId}/products`);
  };
  const getImageForCategory = (categoryName) => {
    //switch to display the images for now because we will need to add an image link to categories
    switch (categoryName) {
      case 'Brakes':
        return brake;
      case 'Suspension':
        return suspension;
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Categories</h2>
      <div className="card-container">
        {categories.map(category => (
          <Card key={category.inventoryId} className="mb-3">
            <Card.Body onClick={() => handleProductsList(category.inventoryId)}>
              <Card.Img variant="top" src={getImageForCategory(category.name)} width={250} height={120} alt="a car part category image" />
              <div className='footer-card'>
              <Card.Title>{category.name}</Card.Title>
            </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default CategoryList;
