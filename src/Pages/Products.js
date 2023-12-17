import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import CategoryList from './Categories';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';

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
      <SiteHeader/>
      <h2 className="mb-4">Products</h2>
      <div class="container">
        <div class="row">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Filters
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Price Low to High</a>
              <a class="dropdown-item" href="#">Price High to Low</a>
            </div>
          </div>

          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Relevence
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Price Low to High</a>
              <a class="dropdown-item" href="#">Price High to Low</a>
            </div>
          </div>
        </div>
      </div>
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
      <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        {/* <span class="sr-only">Previous</span> */}
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default ProductsList;
