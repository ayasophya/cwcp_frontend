import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';
import Carousel from 'react-bootstrap/Carousel';

const AdminProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { categoryId, productId } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const navigate = useNavigate();
    const [showCarCompatibilityModal, setShowCarCompatibilityModal] = useState(false);
    const [carDetails, setCarDetails] = useState({ make: '', model: '', year: '' });

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);

    const [refreshProduct, setRefreshProduct] = useState(false);


    useEffect(() => {
        fetchMakes();
    }, []);

    const fetchMakes = () => {
        fetch(`${APIBaseUrl}/cars/makes`)
            .then(response => response.json())
            .then(data => setMakes(data))
            .catch(error => console.error('Error fetching makes:', error));
    };

    const fetchModels = (make) => {
        fetch(`${APIBaseUrl}/cars/models?make=${make}`)
            .then(response => response.json())
            .then(data => setModels(data))
            .catch(error => console.error('Error fetching models:', error));
    };

    const fetchYears = (model) => {
        fetch(`${APIBaseUrl}/cars/years?model=${model}`)
            .then(response => response.json())
            .then(data => setYears(data))
            .catch(error => console.error('Error fetching years:', error));
    };

    useEffect(() => {
        if (carDetails.make) {
            fetchModels(carDetails.make);
        } else {
            setModels([]);
            setYears([]);
        }
    }, [carDetails.make]);

    useEffect(() => {
        if (carDetails.model) {
            fetchYears(carDetails.model);
        } else {
            setYears([]);
        }
    }, [carDetails.model]);

    useEffect(() => {
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [categoryId, productId, refreshProduct]);

    const handleDeleteClick = () => setShowDeleteConfirmation(true);
    const handleCloseConfirmation = () => setShowDeleteConfirmation(false);
    const handleConfirmDelete = () => {
        console.log('Delete button clicked');
        // Call your API endpoint to delete the product
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    console.log('Product deleted:', response.json());
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Handle the successful deletion
                console.log('Product deleted:', data);
                setShowDeleteConfirmation(false);
                setShowDeleteSuccess(true);
                // Optionally, refresh the product list or navigate away
            })
            .catch(error => {
                // Handle any errors here
                console.error('Error deleting product:', error);
                // Optionally, update state to show an error message
            });
    };

    const handleCloseSuccess = () => {
        setShowDeleteSuccess(false);
        navigate(`/admin/inventory/${categoryId}/products`);
    };

    if (!product) {
        return <div>Loading product details...</div>;
    }
    const handleEditClick = () => {
        navigate(`/admin/categories/${categoryId}/products/${productId}/edit`);
    };

    const handleBackClick = () => {
        navigate(`/admin/inventory/${categoryId}/products`);
    };

    const handleAddCarCompatibilityClick = () => {
        setShowCarCompatibilityModal(true);
    };

    const handleCarCompatibilitySubmit = (e) => {
        e.preventDefault();
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carDetails)
        })
            .then(response => response.json())
            .then(data => {
                // Assume `data` is the updated product details after adding the car compatibility
                setProduct(data); // Update the product state
                setShowCarCompatibilityModal(false);
            })
            .catch(error => console.error('Error adding car compatibility:', error));
    };


    const deleteCarCompatibility = (carMake, carModel, carYear) => {
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}/compatibility?make=${carMake}&model=${carModel}&year=${carYear}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Toggle refreshProduct to re-fetch product details
                setRefreshProduct(prev => !prev);
            })
            .catch(error => {
                console.error('Error deleting car compatibility:', error);
                // Optionally, update state to show an error message
            });
    };

    const arrowStyle = {
        color: 'black',
        fontSize: '3rem'
    };

    return (
        <div className='admin-css'>
            <header className='admin-header'>
                <h1>Admin Page</h1>
            </header>
            <div>
                <div className="product-details-container">
                    <button className="edit-button description-edit" onClick={handleEditClick}>Edit</button>
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
                        <h2 className="product-title">{product.name}</h2>
                        <p className="product-manufacturer-part-number">
                            {product.manufacturerPartNumber}
                        </p>
                        <p className="product-price">{product.price} CA$</p>
                        {/* Add to Cart button removed for admin */}
                        <div className="white-container">
                            <h3 className="section-title">Description</h3>
                            <p className="product-description">{product.description}</p>
                            {product.compatibleCars && product.compatibleCars.length > 0 && (
                                <>
                                    <h3 className="section-title">Compatible Cars</h3>
                                    <table className="supplier-details">
                                        <thead>
                                        <tr>
                                            <th>Make</th>
                                            <th>Model</th>
                                            <th>Year</th>
                                            <th style={{ width: '1em' }}></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {product.compatibleCars.map((car, index) => (
                                            <tr key={index}>
                                                <td>{car.make}</td>
                                                <td>{car.model}</td>
                                                <td>{car.year}</td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteCarCompatibility(car.make, car.model, car.year)}
                                                        className="delete-compatibility-button"
                                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                    >
                                                        <svg viewBox="0 0 24 24" width="16px" height="16px" fill="red" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0 0h24v24H0z" fill="none"/>
                                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                                        </svg>
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                            <button
                                onClick={handleAddCarCompatibilityClick}
                                style={{ marginTop: '20px' }}
                                className="add-car-button"
                            >
                                Add Compatible Car
                            </button>
                        </div>
                        <div className="white-container">
                            <h3 className="section-title">Visible in Admin Panel Only</h3>
                            <p></p>
                            <p><strong>Manufacturer Part Number:</strong> {product.manufacturerPartNumber}</p>
                            <p><strong>Inventory Quantity:</strong> {product.inventoryQuantity}</p>
                            <p><strong>Available Quantity:</strong> {product.availableQuantity}</p>
                            <p><strong>Original Part Number:</strong> {product.originalPartNumber}</p>
                            <p><strong>Status:</strong> {product.status}</p>
                        </div>
                        <div className="button-group">
                            <button className="custom-button back-button" onClick={handleBackClick}>Back to Inventory</button>
                            <button className="custom-button delete-button" onClick={handleDeleteClick}>Delete Product</button>
                        </div>
                    </div>
                </div>
                <Modal show={showDeleteConfirmation} onHide={handleCloseConfirmation}>
                    <Modal.Body className="modal-text">
                        <p>Are you sure you want to delete this product from your inventory?</p>
                        <Button variant="secondary" className="mr-button" onClick={handleCloseConfirmation}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Modal.Body>
                </Modal>



                <Modal show={showDeleteSuccess} onHide={handleCloseSuccess}>
                    <Modal.Body className="modal-text">
                        <p>Product successfully deleted</p>
                        <Button variant="success" onClick={handleCloseSuccess}>
                            OK
                        </Button>
                    </Modal.Body>
                </Modal>

                <Modal show={showCarCompatibilityModal} onHide={() => setShowCarCompatibilityModal(false)} className="car-compatibility-modal">
                    <Modal.Body className="modal-text">
                        <p>Add Compatible Car</p>
                        <form onSubmit={handleCarCompatibilitySubmit} className="car-compatibility-form">
                            <select value={carDetails.make} onChange={e => setCarDetails({ ...carDetails, make: e.target.value })} required>
                                <option value="">Select Make</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                            <select value={carDetails.model} onChange={e => setCarDetails({ ...carDetails, model: e.target.value })} required disabled={!carDetails.make}>
                                <option value="">Select Model</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <select value={carDetails.year} onChange={e => setCarDetails({ ...carDetails, year: e.target.value })} required disabled={!carDetails.model}>
                                <option value="">Select Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <Button type="submit" className="add-compatibility-button">Save</Button>
                        </form>
                    </Modal.Body>
                </Modal>


            </div>
        </div>
    );
};

export default AdminProductDetails;
