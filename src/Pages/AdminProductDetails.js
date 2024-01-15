import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AdminProductDetails = () => {
    const [product, setProduct] = useState(null);
    const { categoryId, productId } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

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
        fetch(`http://localhost:8080/api/v1/inventories/${categoryId}/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Optionally, parse the response if you expect a body
                return response.json();
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
        // ... Add any redirect or state update logic here
    };

    if (!product) {
        return <div>Loading product details...</div>;
    }

    return (
        <div className='admin-css'>
            <header className='admin-header'>
                <h1>Admin Page</h1>
            </header>
            <div>
                <div className="product-details-container">
                    <button className="edit-button description-edit">Edit</button>
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
                        <button className="delete-button" onClick={handleDeleteClick}>Delete Product</button>
                    </div>
                </div>
                <Modal show={showDeleteConfirmation} onHide={handleCloseConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product from your inventory?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmation}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteSuccess} onHide={handleCloseSuccess}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Product successfully deleted.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCloseSuccess}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AdminProductDetails;
