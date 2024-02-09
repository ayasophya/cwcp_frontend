import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { APIBaseUrl } from '../Components/Constants';

const EditProductForm = () => {
    const { categoryId, productId } = useParams();
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product:', error));
    }, [categoryId, productId]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${APIBaseUrl}/categories/${categoryId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Product updated:', data);
                navigate(`/admin/categories/${categoryId}/products/${productId}`);
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    const handleCancel = () => {
        navigate(`/admin/categories/${categoryId}/products/${productId}`);
    };

    return (
        <div className="page-container">
            <h1 className="modal-text">Edit Product</h1>
            <h3 className="manufacturer-part-number">#{product.manufacturerPartNumber}</h3>
            <h3>{product.name}</h3>
            <form onSubmit={handleSubmit}>
                {/* For each field, add a label */}
                <label className="label" htmlFor="name">Name</label>
                <input className="form-input" type="text" name="name" id="name" value={product.name || ''} onChange={handleChange} />

                <label className="label" htmlFor="description">Description</label>
                <textarea
                    className="form-textarea"
                    name="description"
                    id="description"
                    value={product.description || ''}
                    onChange={handleChange}
                ></textarea>
                <label className="label" htmlFor="price">Price</label>
                <input className="form-input" type="number" name="price" id="price" value={product.price || ''} onChange={handleChange} />

                <label className="label" htmlFor="imageLink">Image Link</label>
                <input className="form-input" type="text" name="imageLink" id="imageLink" value={product.imageLink || ''} onChange={handleChange} />

                <label className="label" htmlFor="manufacturerPartNumber">Manufacturer Part Number</label>
                <input className="form-input" type="text" name="manufacturerPartNumber" id="manufacturerPartNumber" value={product.manufacturerPartNumber || ''} onChange={handleChange} />

                <label className="label" htmlFor="originalPartNumber">Original Part Number</label>
                <input className="form-input" type="text" name="originalPartNumber" id="originalPartNumber" value={product.originalPartNumber || ''} onChange={handleChange} />

                <label className="label" htmlFor="inventoryQuantity">Inventory Quantity</label>
                <input className="form-input" type="number" name="inventoryQuantity" id="inventoryQuantity" value={product.inventoryQuantity || ''} onChange={handleChange} />

                <label className="label" htmlFor="availableQuantity">Available Quantity</label>
                <input className="form-input" type="number" name="availableQuantity" id="availableQuantity" value={product.availableQuantity || ''} onChange={handleChange} />

                <label className="label" htmlFor="status">Status</label>
                <select
                    className="form-input"
                    name="status"
                    id="status"
                    value={product.status || 'AVAILABLE'}
                    onChange={handleChange}
                >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                </select>

                <div className="form-actions">
                    <button className="form-button submit-button" type="submit">Update Product</button>
                    <button className="form-button cancel-button" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;
