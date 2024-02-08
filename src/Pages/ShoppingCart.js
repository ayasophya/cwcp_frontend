import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { APIBaseUrl } from '../Components/Constants';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
    const { t } = useTranslation();

    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
    }, [userId])

    const [cart, setCart] = useState(null);
    useEffect(() => {
        fetch(`${APIBaseUrl}/cart/${userId? userId.replace("|", "%7C"): Cookies.get('sessionId')}`)
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
                <h1><bold>{t("cart_title")}</bold></h1>
                
                {cart && cart.cartItems? <div>
                    <table className='cart-table'>
                        <thead>
                            <tr>
                                <td>{t("products_msg")}</td>
                                <td>&nbsp;</td>
                                <td>{t("unit_price")}</td>
                                <td>{t("quantity")}</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.cartItems && cart.cartItems.map(product => {
                                    return <tr> 
                                            <td><img src={product.imgURL} width={70} height={60} alt='product default image'/> </td>
                                            <td>{product.name}</td>
                                            <td>${product.unitPrice} CAD</td>
                                            <td>- &nbsp;{product.quantity} &nbsp; +</td>
                                            <td>${product.totalPrice} CAD</td>
                                        </tr>
                                })}
                        </tbody>
                    </table>
                    <div>
                        <table className='subtotal-table'>
                            {cart.totalCost && <tbody>
                                <tr>
                                    <td>{t("subtotal")}:</td>
                                    <td>${cart.totalCost.toFixed(2)} CAD</td>  
                                </tr>
                            </tbody>}
                        </table>
                    </div>
                    <div style={{textAlign: "left"}}>
                        <Link to={`/categories`} className='cleaned-link'>
                            {"< Continue Shopping"}
                        </Link>
                    </div>
                    <div style={{textAlign: "right"}}>
                        <Link to={`/user/shopping-cart/${cart.cartId}/checkout`} className='cleaned-link'>
                            {"Proceed To Checkout >"}
                        </Link>
                    </div>
                </div>: <p>{t("cart_err")}</p>}
            </main>
            <footer class="footer">
                <SiteFooter/>
            </footer>
        </div>
    );
};

export default ShoppingCart;