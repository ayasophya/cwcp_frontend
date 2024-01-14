import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { categoryId, productId } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [categoryId, productId]);

    if (!product) {
        return <div>Loading product details...</div>;
    }

    const handleAddToCart = () => {
        // Placeholder for add to cart functionality
        console.log('Added to cart:', product.name);
    };


    return (
        <div>
            <SiteHeader/>
            <div className="product-details-container">
                <div className="product-image">
                    <img src={product.imageLink} alt={product.name} />
                </div>
                <div className="product-info">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="product-manufacturer-part-number">
                        {product.manufacturerPartNumber}
                    </p>
                    <p className="product-price">{product.price} CA$</p>
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Add To Cart
                    </button>
                    <div className="white-container"> {/* New white container */}
                        <h3 className="section-title">Description</h3>
                        <p className="product-description">{product.description}</p>
                        {product.compatibleCars && product.compatibleCars.length > 0 && (
                            <>
                                <h3 className="section-title">Compatible Cars</h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Make</th>
                                        <th>Model</th>
                                        <th>Year</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {product.compatibleCars.map((car, index) => (
                                        <tr key={index}>
                                            <td>{car.make}</td>
                                            <td>{car.model}</td>
                                            <td>{car.year}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <footer className="footer">
                <SiteFooter/>
            </footer>
        </div>
    );
};

export default ProductDetails;