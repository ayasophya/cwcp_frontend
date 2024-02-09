import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { APIBaseUrl } from '../Components/Constants';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
    const { t } = useTranslation();
    const [userId, setUserId] = useState(() => Cookies.get('userId'));
    useEffect(() => {
        setUserId(Cookies.get('userId'));
    }, [userId]);

    const [cart, setCart] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedProductForRemoval, setSelectedProductForRemoval] = useState(null);

    useEffect(() => {
        fetch(`${APIBaseUrl}/cart/${userId ? userId.replace("|", "%7C") : Cookies.get('sessionId')}`)
            .then(response => response.json())
            .then(data => setCart(data))
            .catch(error => console.error('Error fetching cart details:', error));
    }, [userId]);

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 0) return;

        fetch(`${APIBaseUrl}/cart/${userId ? userId : Cookies.get('sessionId')}/items/${productId}?quantity=${newQuantity}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data => {
            setCart(data);
        })
        .catch(error => console.error('Error updating item quantity:', error));
    };

    const handleIncreaseQuantity = (productId, currentQuantity) => {
        updateQuantity(productId, currentQuantity + 1);
    };

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity <= 1) {
            setShowModal(true);
            setSelectedProductForRemoval(productId);
        } else {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    const confirmRemoveItem = () => {
        if (!selectedProductForRemoval) return;
        
        const identifier = userId ? userId : Cookies.get('sessionId');

        const url = `${APIBaseUrl}/cart/${identifier}/items/${selectedProductForRemoval}`;
    
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete item: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            setCart(data); 
            setShowModal(false); 
        })
        .catch(error => {
            console.error('Error removing item:', error);
        });
    
        setSelectedProductForRemoval(null);
    };
    
    
    const cancelRemoveItem = () => {
        setShowModal(false);
        setSelectedProductForRemoval(null);
    };
    

    return (
        <div>
            <header>
                <SiteHeader/>
                <Modal show={showModal} onHide={cancelRemoveItem}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Removal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-text">Are you sure you want to remove this item from the cart?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelRemoveItem}>No</Button>
                        <Button variant="danger" onClick={confirmRemoveItem}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </header>
            <main className='cart-page'>
                <h1><strong>{t("cart_title")}</strong></h1>
                {cart && cart.cartItems && cart.cartItems.length > 0 ? (
                    <div>
                        <table className='cart-table'>
                            <thead>
                                <tr>
                                    <td>{t("product")}</td>
                                    <td>&nbsp;</td>
                                    <td>{t("unit_price")}</td>
                                    <td>{t("quantity")}</td>
                                    <td>{t("total")}</td>
                                </tr>
                            </thead>
                            <tbody>
                            {cart.cartItems
                                .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
                                .map((product) => (
                                    <tr key={product.productId}>
                                        <td><img src={product.imgURL} width={70} height={60} alt='product'/></td>
                                        <td>{product.name}</td>
                                        <td>${product.unitPrice} CAD</td>
                                        <td>
                                            <button onClick={() => handleDecreaseQuantity(product.productId, product.quantity)}>-</button>
                                            &nbsp;{product.quantity}&nbsp;
                                            <button onClick={() => handleIncreaseQuantity(product.productId, product.quantity)}>+</button>
                                        </td>
                                        <td>${product.totalPrice} CAD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="checkout-section">
                            <div style={{ textAlign: "left" }}>
                                <Link to="/categories" className='cleaned-link'>{"< Continue Shopping"}</Link>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <Link to={`/user/shopping-cart/${cart.cartId}/checkout`} className='cleaned-link'>{"Proceed To Checkout >"}</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart-message">
                        <p>There are no products in your cart.</p>
                    </div>
                )}
            </main>
            <footer className="footer">
                <SiteFooter/>
            </footer>
        </div>
    );
    
};

export default ShoppingCart;


