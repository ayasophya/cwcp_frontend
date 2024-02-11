import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import Carousel from 'react-bootstrap/Carousel';

const ProductDetails = () => {
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const { categoryId, productId } = useParams();
    const [productCount, setProductCount] = useState(1);
    const [availableQuantity, setAvailableQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const navigate = useNavigate();


    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
    }, [userId])

    useEffect(() => {
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [categoryId, productId]);

    useEffect(() => {

        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}/available-quantity`)
            .then(response => response.json())
            .then(data => setAvailableQuantity(data))
            .catch(error => console.error('Error fetching available quantity:', error));
        if(productCount > availableQuantity)
            setProductCount(availableQuantity);
    }, [productCount]);

    if (!product) {
        return <div>{t("product_load")}</div>;
    }

    const handleContinueShopping = () => {
        setIsAdded(false);
    }
    const handleCheckCart = () => {
        setIsAdded(false);
        navigate("/user/shopping-cart")
    }
   

    const handleAddToCart = () => {
        if(productCount !== 0){
            fetch(`${APIBaseUrl}/cart`, { method: "POST",
                body: JSON.stringify({
                    userId: userId? userId: Cookies.get('sessionId'),
                    productId: product.internalCode,
                    productName: product.name,
                    quantity: productCount,
                    price: product.price,
                    imgURL: product.imageLinks[0]
                }),
                
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
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
    
    const translateProductName = () => {
        let productName = product.name;
        const brakePadsRegex = /brake\s+pads/i;
        const brakeShoeRegex = /brake\s+shoe/i;
        const sportPerformanceRegex = /sport\s+performance/i; 
        const hasBrakePads = brakePadsRegex.test(productName);
        const hasBrakeShoe = brakeShoeRegex.test(productName);
        const hasSportPerformance = sportPerformanceRegex.test(productName); 

        if (hasBrakePads) {
            const translatedBrakePads = t('brake_pads');
            productName = productName.replace(brakePadsRegex, translatedBrakePads);
        }
        if (hasBrakeShoe) {
            const translatedBrakeShoe = t('brake_shoe');
            productName = productName.replace(brakeShoeRegex, translatedBrakeShoe);
        }
        if (hasSportPerformance) {
            const translatedSportPerformance = t('evolution_sport_PN');
            productName = productName.replace(sportPerformanceRegex, translatedSportPerformance);
        }

        return productName;
    };

    const translatedName = translateProductName();

    let translatedDescription = product.description;

    if (product.description.includes('unique friction formula')) {
        translatedDescription = t('friction_desc');
    } else if (product.description.includes('Rubber coated hardware')) {
        translatedDescription = t('rubber_coat_desc');
    } else if (product.description.includes('The Pro-Series OE+ Rear Brake Pad Set')) {
        translatedDescription = t('rear_brake_desc');
    } else if (product.description.includes('dust-free braking')) {
        translatedDescription = t('dust_free_desc');
    }

    const arrowStyle = {
        color: 'black',
        fontSize: '3rem'
    };
    
    return (
        <div>
            <SiteHeader/>
            <div className="product-details-container">
                <div className="product-image">
                    <Carousel nextIcon={<span style={arrowStyle}>&rsaquo;</span>} prevIcon={<span style={arrowStyle}>&lsaquo;</span>}>
                        {product.imageLinks.map((link, index) => (
                        <Carousel.Item key={index}>
                            <img src={link} alt={`Product ${index + 1}`} />
                        </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className="product-info">
                <h2 className="product-title">{translatedName}</h2>
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
                        {t("add_cart")}
                    </button>
                    <div className="white-container"> {/* New white container */}
                        <h3 className="section-title">Description</h3>
                        <p className="product-description">{translatedDescription}</p>
                        {product.compatibleCars && product.compatibleCars.length > 0 && (
                            <>
                                <h3 className="section-title">{t("compatible_cars")}</h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>{t("make")}</th>
                                        <th>{t("model")}</th>
                                        <th>{t("year")}</th>
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
                        <p>{t("added_cart")}</p>
                        <Button variant="secondary" className="mr-button" onClick={handleContinueShopping}>
                            {t("cont_shop")}
                        </Button>
                        <Button variant="danger" onClick={handleCheckCart}>
                            {t("view_cart")}
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