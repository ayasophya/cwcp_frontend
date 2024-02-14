import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { APIBaseUrl } from '../Components/Constants';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import '../styles/Contents.css'

const AddressPage = () => {
    const navigate = useNavigate();
    const userId = Cookies.get('userId');
    const [address, setAddress] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        streetAddress: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        fetch(`${APIBaseUrl}/users/address/${userId}`)
            .then(response => response.json())
            .then(data => {
                setAddress(data);
                setForm(data || {});
            })
            .catch(error => {
                console.error("Error fetching address:", error);
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.streetAddress) newErrors.streetAddress = 'Street address cannot be empty';
        if (!form.city) newErrors.city = 'City cannot be empty';
        if (!form.province) newErrors.province = 'Province cannot be empty';
        if (!form.postalCode) newErrors.postalCode = 'Postal code cannot be empty';
        if (!form.country) newErrors.country = 'Country cannot be empty';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        fetch(`${APIBaseUrl}/users/address/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save address');
                return response.json();
            })
            .then(() => {
                setShowModal(false);
                navigate('/user/account-management');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className='App'>
            <SiteHeader />
            <h2>Shipping Address</h2>
            <div className="address-page">
                <p className="breadcrumb-container">
                    <span className="clickable-breadcrumb" onClick={() => navigate('/user/account-management')}>Your Account</span>
                    {' '} / Your Address
                     </p>
                {address ? (
                    <div className="address-display">
                        <p>{address.streetAddress}</p>
                        <p>{`${address.city}, ${address.province}`}</p>
                        <p>{address.postalCode}</p>
                        <p>{address.country}</p>
                        <Button variant="primary" onClick={() => setShowModal(true)}>Edit Address</Button>
                    </div>
                ) : (
                    <>
                        <p>No address has been added yet.</p>
                        <Button variant="primary" onClick={() => setShowModal(true)}>Add Address</Button>
                    </>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{address ? 'Edit Address' : 'Add Address'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {Object.values(errors).map((error, index) => (
                                <Alert key={index} variant="danger">{error}</Alert>
                            ))}
                            <Form.Group controlId="formStreetAddress">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter street address"
                                    name="streetAddress"
                                    value={form.streetAddress}
                                    onChange={handleChange}
                                    isInvalid={!!errors.streetAddress}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.streetAddress}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    isInvalid={!!errors.city}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.city}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formProvince">
                                <Form.Label>Province</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter province"
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    isInvalid={!!errors.province}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.province}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formPostalCode">
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter postal code"
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    isInvalid={!!errors.postalCode}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.postalCode}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formCountry">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter country"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    isInvalid={!!errors.country}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.country}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                {address ? 'Update Address' : 'Save Address'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
            <SiteFooter />
        </div>
    );
};

export default AddressPage;

