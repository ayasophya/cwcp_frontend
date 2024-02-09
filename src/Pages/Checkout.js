import React, { useState, useEffect } from 'react';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { APIBaseUrl } from '../Components/Constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartId } = useParams();
    const countryOptions = ['Select Country', 'Canada', 'United-States'];
    const [provinceOptions, setProvinceOptions] = useState([]);
    // const [transaction, setTransaction] = useState(null);
    const navigate = useNavigate();

    const [shippingDetails, setShippingDetails] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNb: '',
        address: '',
        city: '',
        postalcode: '',
        province: '',
        country: '',
    });

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

    useEffect(() => {
        fetch(`${APIBaseUrl}/cart/${cartId}/transactions/provinces?country=${shippingDetails.country}`)
            .then(response => response.json())
            .then(data => {
                const provinces = Object.values(data);
                setProvinceOptions(provinces);
            })
            .catch((error) => console.error('Error generating order: ' + error))
    }, [shippingDetails.country])

    const createBill = ()=>{
        fetch(`${APIBaseUrl}/cart/${cartId}/transactions`, { method: "POST",            
            body: JSON.stringify({
                firstName: shippingDetails.fname,
                lastName: shippingDetails.lname,
                email: shippingDetails.email,
                phoneNumber: shippingDetails.phoneNb,
                amount: cart.totalCost,
                shippingStreetAddress: shippingDetails.address,
                shippingCity: shippingDetails.city,
                shippingProvince: shippingDetails.province,
                shippingPostalCode: shippingDetails.postalcode,
                shippingCountry: shippingDetails.country,
                billingStreetAddress: shippingDetails.address,
                billingCity: shippingDetails.city,
                billingProvince: shippingDetails.province,
                billingCountry: shippingDetails.postalcode,
                billingPostalCode: shippingDetails.country,
                shippingCost: shipmentPrice
            }),
        
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        // .then(response => response.json())
        // .then(data => setTransaction(data))
        .catch((error) => console.error('Error generating order: ' + error))
        
        // console.log("oteqh" + transaction)
        // Navigate(`/user/transactions/${transaction.transactionId}`);
        navigate('/user/transactions');
    }

    let [shipmentPrice, setShipmentPrice] = useState(null);
    const getShipmentCost = (e) => {
        e.preventDefault();
        fetch(`${APIBaseUrl}/cart/${cartId}/transactions/shipment-rate?country=${shippingDetails.country}&postalCode=${shippingDetails.postalcode}&city=${shippingDetails.city}&province=${shippingDetails.province}`)
        .then(response => response.json())
        .then(data => setShipmentPrice(data))
        .catch((error) => console.error('Error generating order: ' + error))

        if(shipmentPrice === 0)
            shipmentPrice = null;
    }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setShippingDetails((prevDetails) => ({
    //   ...prevDetails,
    //   [name]: value,
    // }));
    if (name === 'country') {
        setShippingDetails((prevDetails) => ({
          ...prevDetails,
          country: value,
          province: '',
        }));
      } else {
        setShippingDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
      }
  };

  return (
    <div>
        <SiteHeader/>
        <div style={{ display: 'flex' }}>
        <div className="shipping-details checkout-form">
            <h1>Checkout</h1>
            <h2>Shipping Details</h2>
            <form onSubmit={getShipmentCost}>
                <input
                type="text"
                name="fname"
                placeholder='First Name'
                required={true}
                onChange={handleInputChange}
                className="rounded-input"
                />
                <input
                type="text"
                name="lname"
                placeholder='Last Name'
                required={true}
                onChange={handleInputChange}
                className="rounded-input"
                />
            <br />
            <input
                type="text"
                name="email"
                placeholder='Email'
                required={true}
                pattern='^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'
                title="Must be a valid email format"
                onChange={handleInputChange}
                className="rounded-input"
                />
                <input
                type="text"
                name="phoneNb"
                placeholder='Phone Number'
                pattern='^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$'
                title="Must be a valid phone number"
                required={true}
                onChange={handleInputChange}
                className="rounded-input"
                />
            <br />
            <input
              type="text"
              name="address"
              placeholder='Street Address'
              required={true}
              onChange={handleInputChange}
              className="rounded-input"
              style={{width: "57.5%"}}
            />
            <br />
            <input
              type="text"
              name="city"
              placeholder='City'
              required={true}
              onChange={handleInputChange}
              className="rounded-input"
            />
            <input
              type="text"
              name="postalcode"
              placeholder='Postal Code'
              required={true}
              onChange={handleInputChange}
              className="rounded-input"
            />
            <br />
            <label>
            <select
              name="country"
              className='rounded-input'
              required={true}
              value={shippingDetails.country}
              onChange={handleInputChange}
            >
              {countryOptions.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          {shippingDetails.country && (
            <label>
              <select
                name="province"
                className='rounded-input'
                required={true}
                value={shippingDetails.province}
                onChange={handleInputChange}
              >
                {provinceOptions.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>
          )}
          <br/>
          <input type='submit' className='validate-button' value="Validate Address"/>
            </form>
            
        </div>

        {cart !== null && 
        <div style={{ flex: 1, margin: "0px 25px" }}>
            <h2>Shopping Items</h2>
            <table style={{ width: '100%' }}  className='cart-table'>
                <thead>
                    <tr>
                    <th>Products</th>
                    <th></th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.cartItems.map((item) => (
                    <tr key={item.itemId}>
                        <td>
                        <img
                            src={item.imgURL}
                            alt={item.name}
                            style={{ width: '50px', height: '50px' }}
                        />
                        </td>
                        <td>{item.name}</td>
                        <td>${item.unitPrice.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.totalPrice).toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            {(shipmentPrice && shipmentPrice > 0) &&
            <div className='totals-table'>
                <table>
                    <tbody>
                        <tr>
                            <td>{t("subtotal")}:</td>
                            <td>${cart.totalCost.toFixed(2)} CAD</td>  
                        </tr>
                        <tr>
                            <td>Shipment Cost:</td>
                            <td>${(shipmentPrice).toFixed(2)} CAD</td>
                        </tr>
                        <tr>
                            <td>{t("tax")}:</td>
                            <td>${((cart.totalCost + shipmentPrice) * 0.14975).toFixed(2)} CAD</td>
                        </tr>
                        <tr>
                            <td>Total:</td>
                            <td>${((cart.totalCost + shipmentPrice) * 1.14975).toFixed(2)} CAD</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
        {(shipmentPrice && shipmentPrice > 0) && <button onClick={createBill} className='order-btn'>ORDER</button>}
        </div>}
      </div>

      <footer className='footer'>
        <SiteFooter />
      </footer>
    </div>
  );
};

export default CheckoutPage;
