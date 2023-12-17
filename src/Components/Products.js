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
        if (make) {
            fetchModels(make);
        } else {
            // Clear models and years if no make is selected
            setModels([]);
            setYears([]);
        }
        // Reset model and year when make changes
        setModel('');
        setYear('');
    }, [make]);


    useEffect(() => {
        if (model) {
            fetchYears(model);
        } else {
            // Reset year when model is empty (i.e., "Select Model" is chosen)
            setYear('');
            setYears([]);
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
            if (make === '') {
                fetchAllProducts();
            } else {
                const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => setProducts(data))
                    .catch(error => console.error('Error fetching products:', error));
            }
            setFilterClicked(false);
        }
    }, [filterClicked, categoryId, make, model, year]);



    const handleFilterSubmit = (event) => {
        event.preventDefault();
        if (make && !model) {
            alert("Please select a model.");
            return;
        }
        if (model && !year) {
            alert("Please select a year.");
            return;
        }
        setFilterClicked(true);
        setIsFilterApplied(make || model || year); // Set this based on any filter being applied
    };




    const handleClearFilter = () => {
        setMake('');
        setModel('');
        setYear('');
        fetchAllProducts();
        setIsFilterApplied(false); // Also reset this state
    };


    const [isFilterApplied, setIsFilterApplied] = useState(false);

    return (
        <div>
            <h2 className="mb-4">Products</h2>
            <form onSubmit={handleFilterSubmit}>
                Choose Vehicle: <select className="custom-select" value={make} onChange={e => setMake(e.target.value)}>
                    <option value="">Select Make</option>
                    {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </select>

                <select className={`custom-select ${!make || makes.length === 0 ? 'disabled-select' : ''}`} value={model} onChange={e => setModel(e.target.value)} disabled={!make || makes.length === 0}>
                    <option value="">Select Model</option>
                    {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select className={`custom-select ${!model || models.length === 0 ? 'disabled-select' : ''}`} value={year} onChange={e => setYear(e.target.value)} disabled={!model || models.length === 0}>
                    <option value="">Select Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <button type="submit" className="custom-button">View Results</button>
                {(make || model || year) && (
                    <button type="button" className="custom-button" onClick={handleClearFilter}>Clear Vehicle</button>
                )}
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
