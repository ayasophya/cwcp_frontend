import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import Cookies from 'js-cookie';

const ShoppingCart = () => {
    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
    }, [userId])

    const [cart, setCart] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/cart/${userId? userId.slice(6): Cookies.get('sessionId')}`)
            .then(response => response.json())
            .then(data => setCart(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, []);
    return (
        <div>
            <header>
                <SiteHeader/>
            </header>
            <main className='cart-page'>
                <h1><bold>YOUR CART</bold></h1>
                
                <table className='cart-table'>
                    <td>
                        <tr>Products</tr>
                        {cart && cart.cartItems.map(product => {
                            return <tr><img src={product.imgURL} width={70} height={60} alt='product default image'/> </tr>
                        })}
                    </td>
                    <td>
                        <tr>&nbsp;</tr>
                        {cart && cart.cartItems.map(product => {
                            return <tr>{product.name}</tr>
                        })}
                    </td>
                    <td>
                        <tr>Unit Price</tr>
                        {cart && cart.cartItems.map(product => {
                            return <tr>${product.unitPrice} CAD</tr>
                        })}
                    </td>
                    <td>
                        <tr>Quantity</tr>
                        {cart && cart.cartItems.map(product => {
                            return <tr>- &nbsp;{product.quantity} &nbsp;+</tr>
                        })}
                    </td>
                    <td>
                        <tr>Total</tr>
                        {cart && cart.cartItems.map(product => {
                            return <tr>${product.totalPrice} CAD</tr>
                        })}
                    </td>
                </table>
                <div>
                    <table>
                        <td>
                            <tr>Subtotal:</tr>
                            <tr>Taxes:</tr>
                            <tr>Total:</tr>
                        </td>
                        <td>
                            <tr>${cart.totalCost} CAD</tr>  
                        </td>
                    </table>
                </div>
            </main>
            <footer class="footer">
                <SiteFooter/>
            </footer>
        </div>
    );
};

export default ShoppingCart;