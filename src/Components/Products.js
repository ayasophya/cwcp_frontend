import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import CategoryList from './Categories';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();


  useEffect(() => {
      fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }, [categoryId]);

  return (
    <div>
      <h2 className="mb-4">Products</h2>
      <div className="card-container">
      {products.length === 0 ? (
          <p>No products available</p>
        ) : (products.map(product => (
          <Card key={product.internalCode} className="mb-3">
            <Card.Body>
            <Card.Img variant="top" src={product.imageLink} alt={product.name} />
              <Card.Title>{product.name}</Card.Title>
              <p>{product.price} CA$</p>
            </Card.Body>
          </Card>
        ))
        )}
      </div>
    </div>
  );
};

export default ProductsList;
