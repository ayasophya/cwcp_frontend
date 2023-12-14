import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import CategoryList from './Categories';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    const [filterClicked, setFilterClicked] = useState(false);

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        // Fetch makes from your backend
        fetchMakes();
    }, []);

    useEffect(() => {
        // Fetch models when a make is selected
        if (make) {
            fetchModels(make);
        }
    }, [make]);

    useEffect(() => {
        // Fetch years when a model is selected
        if (model) {
            fetchYears(model);
        }
    }, [model]);

    const fetchMakes = () => {
        // Fetch makes from your backend and update the makes state
        fetch('http://localhost:8080/api/v1/cars/makes') // Replace with your actual endpoint
            .then(response => response.json())
            .then(data => {
                setMakes(data); // Assuming the response is a list of makes
            })
            .catch(error => console.error('Error fetching makes:', error));
    };

    const fetchModels = (selectedMake) => {
        // Fetch models based on the selected make
        fetch(`http://localhost:8080/api/v1/cars/models?make=${selectedMake}`) // Replace with your actual endpoint
            .then(response => response.json())
            .then(data => {
                setModels(data); // Assuming the response is a list of models for the selected make
            })
            .catch(error => console.error('Error fetching models:', error));
    };

    const fetchYears = (selectedModel) => {
        // Fetch years based on the selected model
        fetch(`http://localhost:8080/api/v1/cars/years?model=${selectedModel}`) // Replace with your actual endpoint
            .then(response => response.json())
            .then(data => {
                setYears(data); // Assuming the response is a list of years for the selected model
            })
            .catch(error => console.error('Error fetching years:', error));
    };

    useEffect(() => {
        fetchAllProducts();
    }, [categoryId]);

    const fetchAllProducts = () => {
        fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products`)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }

    useEffect(() => {
        if (filterClicked) {
            const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
            fetch(url)
                .then(response => response.json())
                .then(data => setProducts(data))
                .catch(error => console.error('Error fetching products:', error));
            setFilterClicked(false);
        }
    }, [filterClicked, categoryId, make, model, year]);

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        if (!make || !model || !year) {
            alert("Please specify all fields: Make, Model, and Year.");
            return;
        }
        setFilterClicked(true);
    };

    const handleClearFilter = () => {
        setMake('');
        setModel('');
        setYear('');
        fetchAllProducts();
    };

    return (
        <div>
            <h2 className="mb-4">Products</h2>
            <form onSubmit={handleFilterSubmit}>
                <select value={make} onChange={e => setMake(e.target.value)}>
                    <option value="">Select Make</option>
                    {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </select>

                <select value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
                    <option value="">Select Model</option>
                    {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select value={year} onChange={e => setYear(e.target.value)} disabled={!model}>
                    <option value="">Select Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <button type="submit">Filter</button>
                <button type="button" onClick={handleClearFilter}>Clear Filter</button>
            </form>

            <div className="card-container">
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (products.map(product => (
                        <Card key={product.internalCode} className="mb-3">
                            <Card.Body>
                                <Card.Img variant="top" src={product.imageLink} alt={product.name} />
                                <Card.Title>{product.name}</Card.Title>
                                <p>{product.price} CA$</p>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductsList;
