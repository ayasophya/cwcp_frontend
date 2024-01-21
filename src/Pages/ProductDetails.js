import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { categoryId, productId } = useParams();
    const [productCount, setProductCount] = useState(1);
    const [availableQuantity, setAvailableQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    
    const [cart, setCart] = useState(null);

    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        // if(userId === undefined)
        //     setUserId(Cookies.get('sessionId'));
        // else
            setUserId(Cookies.get('userId'))
        console.log('userId: ', userId)
    }, [userId])

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [categoryId, productId]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}/available-quantity`)
            .then(response => response.json())
            .then(data => setAvailableQuantity(data))
            .catch(error => console.error('Error fetching available quantity:', error));
        if(productCount > availableQuantity)
            setProductCount(availableQuantity);
    }, [productCount]);

    if (!product) {
        return <div>Loading product details...</div>;
    }

    const handleContinueShopping = () => {
        setIsAdded(false);
    }

    const handleAddToCart = () => {
        if(productCount !== 0){
            fetch("http://localhost:8080/api/v1/cart", { method: "POST",
                body: JSON.stringify({
                    userId: userId? userId: Cookies.get('sessionId'),
                    productId: product.internalCode,
                    productName: product.name,
                    quantity: productCount,
                    price: product.price,
                    imgURL: product.imageLink
                }),
                
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(data => setCart(data))
            .then(console.log("cart response: " + cart))
            .then(setIsAdded(true))
            console.log('Added to cart:', product.name);
        }
        else
            window.alert("Please add at least one item to cart")
    };

    const addProductCount = () => {
        if(productCount !== availableQuantity)
            setProductCount(productCount + 1);
    }
    const removeProductCount = () => {
        if(productCount > 1)
            setProductCount(productCount - 1);
    }

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
                    <div>
                        <button onClick={removeProductCount} className='quantity-button'> - </button>
                        {productCount}
                        <button onClick={addProductCount} className='quantity-button'> + </button>
                    </div>
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
            <Modal show={isAdded}>
                    <Modal.Body className="modal-text">
                        <p>Product successfully added to cart!</p>
                        <Button variant="secondary" className="mr-button" onClick={handleContinueShopping}>
                            Continue Shopping
                        </Button>
                        <Button variant="danger" /*onClick={handleConfirmDelete}*/>
                            View Cart
                        </Button>
                    </Modal.Body>
                </Modal>
            <footer className="footer">
                <SiteFooter/>
            </footer>
        </div>
    );
};

export default ProductDetails;