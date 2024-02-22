import React, { useState, useEffect } from 'react';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { APIBaseUrl } from '../Components/Constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';
import StripeCheckout from "react-stripe-checkout";
import logo from "../Components/Images/tire_logo.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const [userInfo, setUserInfo] = useState(null);
    const [userAddress, setUserAddress] = useState(null);

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

    useEffect(() => {
        if (userId) {
            // Fetch user info
            fetch(`${APIBaseUrl}/cwcp/security/user-info/auth0%7C${userId.slice(6)}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched user info: ", data);
                    setUserInfo(data);
                })
                .catch(error => console.error('Error fetching user info:', error));

            // Fetch user address
            fetch(`${APIBaseUrl}/users/address/${userId}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched user address: ", data);
                    setUserAddress(data);
                })
                .catch(error => console.error('Error fetching address:', error));
        }
    }, [userId]);

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
        .catch((error) => console.error('Error generating order: ' + error))
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

    const fillCheckoutForm = () => {
        if (userInfo && userAddress) {
            console.log("Filling form with: ", userInfo, userAddress);
            setShippingDetails({
                fname: userInfo.name.split(' ')[0],
                lname: userInfo.name.split(' ')[1] || '',
                email: userInfo.email,
                phoneNb: '', // Assuming phone number is not part of user info
                address: userAddress.streetAddress,
                city: userAddress.city,
                postalcode: userAddress.postalCode,
                province: userAddress.province,
                country: userAddress.country,
            });
        }
    };

  async function handleToken(token) {
    // const request = await fetch(`${APIBaseUrl}/transactions/charge`, { method: "POST",
    //     headers: {
    //         "token":token.id,
    //         "amount": ((cart.totalCost + shipmentPrice) * 1.14975).toFixed(2)
    //     }
    // })
    // if(request.status === 201)
    //   createBill()
    // else{
    //   toast.error("There was a problem while completing the purchase", {
    //     position: "top-right"
    //   });
    // }
    fetch(`${APIBaseUrl}/transactions/charge`, {
      method: 'POST',
      headers: {
        "token":token.id,
        "amount": ((cart.totalCost + shipmentPrice) * 1.14975).toFixed(2)
      }
    }).then(response => {
        if (response.status !== 201) {
            throw new Error('Network response was not ok');
        }
        createBill()
    })
    .catch(error => {
      toast.error("There was a problem while completing the purchase", {
        position: "top-right"
      });
    });
  }
  return (
    <div>
        <SiteHeader/>
        <div style={{ display: 'flex' }}>
            <div className="checkout-container">
        <div className="shipping-details checkout-form">
            <h1>Checkout</h1>
            <h2>Shipping Details</h2>
            <form onSubmit={getShipmentCost}>
                {userId && (
                    <button
                        onClick={fillCheckoutForm}
                        className='fill-form-button'
                        style={{
                            backgroundColor: '#5B5B5B',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginBottom: '10px'
                        }}
                    >
                        Use Account Details
                    </button>
                )}
                <br />

                <input
                type="text"
                name="fname"
                placeholder='First Name'
                required={true}
                onChange={handleInputChange}
                className="rounded-input"
                value={shippingDetails.fname}
                />
                <input
                type="text"
                name="lname"
                placeholder='Last Name'
                required={true}
                onChange={handleInputChange}
                className="rounded-input"
                value={shippingDetails.lname}
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
                value={shippingDetails.email}
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
                value={shippingDetails.phoneNb}
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
              value={shippingDetails.address}
            />
            <br />
            <input
              type="text"
              name="city"
              placeholder='City'
              required={true}
              onChange={handleInputChange}
              className="rounded-input"
              value={shippingDetails.city}
            />
            <input
              type="text"
              name="postalcode"
              placeholder='Postal Code'
              required={true}
              onChange={handleInputChange}
              className="rounded-input"
              value={shippingDetails.postalcode}
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
            {(shipmentPrice && shipmentPrice > 0)?
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
            </div>: <p>Please provide a valid address</p>}
        {(shipmentPrice && shipmentPrice > 0) &&
          <StripeCheckout
          amount={((cart.totalCost + shipmentPrice) * 1.14975).toFixed(2) * 100}
          label='Confirm Order'
          name='Confirm Purchase'
          billingAddress
          image={logo}
          description={`Your total is $${((cart.totalCost + shipmentPrice) * 1.14975).toFixed(2)}`}
          panelLabel='Pay Now'
          currency='CAD'
          stripeKey="pk_test_51OjfvgEZIdUusexSYhHINkgTksTQVMoY0LtBo5matJ2cr0P5E4IZzWQ2TCK2u7Sa9W6zwmAMdg4jHky6LQYhGL3100VIiTf1YT"
          token={handleToken}/>
        }
        </div>}
      </div>
        </div>

      <footer className='footer'>
        <SiteFooter />
      </footer>
    </div>
  );
};

export default CheckoutPage;
