import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        fetchMakes();
    }, []);

    const fetchMakes = () => {
        fetch('http://localhost:8080/api/v1/cars/makes')
            .then(response => response.json())
            .then(data => setMakes(data))
            .catch(error => console.error('Error fetching makes:', error));
    };

    const fetchModels = (make) => {
        fetch(`http://localhost:8080/api/v1/cars/models?make=${make}`)
            .then(response => response.json())
            .then(data => setModels(data))
            .catch(error => console.error('Error fetching models:', error));
    };

    const fetchYears = (model) => {
        fetch(`http://localhost:8080/api/v1/cars/years?model=${model}`)
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
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [categoryId, productId]);

    const handleDeleteClick = () => setShowDeleteConfirmation(true);
    const handleCloseConfirmation = () => setShowDeleteConfirmation(false);
    const handleConfirmDelete = () => {
        console.log('Delete button clicked');
        // Call your API endpoint to delete the product
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}`, {
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
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carDetails)
        })
            .then(response => response.json())
            .then(data => {
                // Handle success - maybe refresh product details or show a success message
                setShowCarCompatibilityModal(false);
            })
            .catch(error => console.error('Error adding car compatibility:', error));
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
                        <img src={product.imageLink} alt={product.name} />
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
                                    <button
                                        onClick={handleAddCarCompatibilityClick}
                                        style={{ marginTop: '20px' }}
                                    >
                                        Add Compatible Car
                                    </button>
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

                <Modal show={showCarCompatibilityModal} onHide={() => setShowCarCompatibilityModal(false)}>
                    <Modal.Body>
                        <form onSubmit={handleCarCompatibilitySubmit}>
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
                            <Button type="submit" >Add Compatibility</Button>
                        </form>
                    </Modal.Body>
                </Modal>


            </div>
        </div>
    );
};

export default AdminProductDetails;
