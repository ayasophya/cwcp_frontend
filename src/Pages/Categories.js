import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import brake from './../Components/Images/category_brake.png'; 
import suspension from './../Components/Images/category_suspension.png'; 
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { useTranslation } from "react-i18next";

import { APIBaseUrl } from '../Components/Constants';

const CategoryList = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  

  const handleProductsList = (categoryId) => {
    navigate(`/categories/${categoryId}/products`);
  };
  // const getImageForCategory = (categoryName) => {
  //   //switch to display the images for now because we will need to add an image link to categories
  //   switch (categoryName) {
  //     case 'Brakes':
  //       return brake;
  //     case 'Suspension':
  //       return suspension;
  //   }
  // };

  useEffect(() => {
    fetch(`${APIBaseUrl}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div>
      <SiteHeader/>
      <h2 className="mb-4">{t("categories_msg")}</h2>
      <div className="card-container">
        {categories.map(category => (
          <Card key={category.inventoryId} className="mb-3">
            <Card.Body onClick={() => handleProductsList(category.inventoryId)} id='card_body'>
              <Card.Img variant="top" src={category.imageLink} width={250} height={120} alt="a car part category image" />
              <div className='footer-card'>
              <Card.Header>{t(category.name)}</Card.Header>
              </div>
              {/* <Card.Text class="footer-card">{category.name}</Card.Text> */}
            </Card.Body>
          </Card>
        ))}
      </div>
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};
export default CategoryList;
