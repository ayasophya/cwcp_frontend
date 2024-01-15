import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CarDetails } from '../Components/Constants';
import Pagination from '@mui/material/Pagination';
import { forIn } from 'lodash';

const ProductsList = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  const [filterClicked, setFilterClicked] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false); 

  const [pageNb, setPageNb] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const itemsPerPage = 4;
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
      fetchMakes();

      setMake(CarDetails.make);
  }, []);

  useEffect(() => {
    if (make) {
      fetchModels(make);

    } else {
        setModels([]);
        setYears([]);
    }

    setModel('');
    setYear('');
    setModel(CarDetails.model);
  }, [make]);

  useEffect(() => {
    if (model) {
      fetchYears(model);
    } else {
      setYear('');
      setYears([]);
    }
    setYear(CarDetails.year);
  }, [model]);

  const fetchMakes = () => {
    fetch('http://localhost:8080/api/v1/cars/makes')
        .then(response => response.json())
        .then(data => {
            setMakes(data);
        })
        .catch(error => console.error('Error fetching makes:', error));
  };

    const fetchModels = (selectedMake) => {
        fetch(`http://localhost:8080/api/v1/cars/models?make=${selectedMake}`)
            .then(response => response.json())
            .then(data => {
                setModels(data);
            })
            .catch(error => console.error('Error fetching models:', error));
    };

    const fetchYears = (selectedModel) => {
        fetch(`http://localhost:8080/api/v1/cars/years?model=${selectedModel}`)
            .then(response => response.json())
            .then(data => {
                setYears(data);
            })
            .catch(error => console.error('Error fetching years:', error));
    };

  useEffect(() => {
    if (query) {
      if (CarDetails.make && CarDetails.model && CarDetails.year) {
        fetchFilteredSearchedProducts(query, CarDetails.make, CarDetails.model, CarDetails.year);
      } else {
        fetchAllSearchedProducts(query);
      }
    } 
    else if(CarDetails.make && CarDetails.model && CarDetails.year){
      const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/filter?make=${CarDetails.make}&model=${CarDetails.model}&year=${CarDetails.year}`;
      fetch(url)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }
    else {
        fetchAllProducts();
    }
    configurePagination();
  }, [query, categoryId, CarDetails.make, CarDetails.model, CarDetails.year]);

  const fetchAllProducts = () => {
      fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products`)
          .then(response => response.json())
          .then(data => setProducts(data))
          .then(() => listOfProducts())
          .catch(error => console.error('Error fetching products:', error));
      
      configurePagination();
  }
  const fetchAllSearchedProducts = (searchQuery) => {
      fetch(`http://localhost:8080/api/v1/categories/products/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
      
      configurePagination();
    }
  const fetchFilteredSearchedProducts = (searchQuery, make, model, year) => {
    fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/search?query=${encodeURIComponent(searchQuery)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    configurePagination();
  }

  useEffect(() => {
    if (filterClicked) {
      if (make === '' && model === '' && year === '' && !CarDetails.exist) {
        fetchAllProducts();
      }
      else {
        CarDetails.make = make;
        CarDetails.model = model;
        CarDetails.year = year;
        
        const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
          fetch(url)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
      }
      setFilterClicked(false);
      setIsSearchVisible(true); 
    }
    configurePagination();
  }, [filterClicked, categoryId, make, model, year]);

  const handleFilterSubmit = async (event) => {
    event.preventDefault();
    setProducts([]);

    if (make && !model) {
      alert("Please select a model.");
      return;
    }
    if (model && !year) {
      alert("Please select a year.");
      return;
    }

    if (query) {
      try {
        console.log("cat is ", categoryId)
        const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/search?query=${encodeURIComponent(searchQuery)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`;
        const response = await fetch(url);
        const data = await response.json();
        //setProducts(data);
        setProducts([data]);

      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setFilterClicked(true);
      setIsFilterApplied(make || model || year);
      CarDetails.make = make;
      CarDetails.model = model;
      CarDetails.year = year;
      const url = `http://localhost:8080/api/v1/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        //setProducts(data);
        setProducts([...data]);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    CarDetails.make = make;
    CarDetails.model = model;
    CarDetails.year = year;
    setFilterClicked(false);
    setIsSearchVisible(true);
    configurePagination();
  };

    const handleClearFilter = () => {
      setMake('');
      setModel('');
      setYear('');

      if(query) {
        fetchAllSearchedProducts(query)
      }
      else{
        fetchAllProducts();
      }   
      setIsFilterApplied(false);
      setIsSearchVisible(false);
    };

    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const handleSearchSubmit = async (event) => {
      event.preventDefault();
      setIsSearchVisible(true);
      setFilterClicked(false);
      CarDetails.exist=true;
      
      try {
        let url = `http://localhost:8080/api/v1/categories/${categoryId}/products/search?query=${encodeURIComponent(searchQuery)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`;
        
        const response = await fetch(url);
        const data = await response.json();
    
        //setProducts(data);
        setProducts([...data]);

      }
      catch (error) {
        console.error('Error fetching search results:', error);
      }
      configurePagination();
    };

  const configurePagination = () => {
    setPageAmount(Math.ceil(products.length / itemsPerPage));
    console.log("Page amount: " + pageAmount)
  }

  const listOfProducts = () => {
    var newArr = [];
    if(pageAmount == pageNb)
      newArr = products.slice((pageNb * itemsPerPage) - itemsPerPage, products.length)
    else
      newArr = products.slice((pageNb * itemsPerPage) - itemsPerPage, pageNb * itemsPerPage)
    
    return newArr.map(product => (
      <Card key={product.internalCode} className="mb-3">
        <Card.Body>
        <Card.Img variant="top" src={product.imageLink} alt={product.name} />
          <Card.Title>
              <Link to={`/categories/${product.inventoryId}/products/${product.internalCode}`}>
                  {product.name}
              </Link>
          </Card.Title>
          <p>{product.price} CA$</p>
        </Card.Body>
      </Card>
    ));
  }

  useEffect(() => {
    configurePagination();
  }, [products]); 

  const onPageChange = (event, value) => {
    configurePagination();
    setPageNb(value);
  };

  const handlePriceSort = async (sortOption) => {
    if (sortOption === 'lowToHigh') {
      fetchProductsLowToHigh();
    } else if (sortOption === 'highToLow') {
      fetchProductsHighToLow();
    }
  };

  const fetchProductsHighToLow = () => {
    fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/price_sort_high_to_low`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }

  const fetchProductsLowToHigh = () => {
    fetch(`http://localhost:8080/api/v1/categories/${categoryId}/products/price_sort_low_to_high`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }
  useEffect(() => {
    if (sortBy) {
      handlePriceSort(sortBy);
    }
  }, [sortBy]);

  return (
    <div>
      <SiteHeader/>
      <h2 className="mb-4">{isSearchVisible
          ? `Search results for "${searchQuery}" for ${make} ${model} ${year}`
          : 'Products'}</h2>
          
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
                <div className="container">   
                <label htmlFor="sortSelect"></label>
                <select
                  className="custom-select"
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by Price</option>
                  <option value="lowToHigh">Price Low to High</option>
                  <option value="highToLow">Price High to Low</option>
                </select>
                </div>
              </form>
            {isSearchVisible && (
            <form onSubmit={handleSearchSubmit} className="ml-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </div>
              </div>
            </form>
          )}
      <div className="card-container">
      {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          listOfProducts()
        )}
      </div>

      {products.length > 0 && <Pagination count={pageAmount} size="small" page={pageNb} onChange={onPageChange} disabled={pageAmount == 1? true: false}
      hideNextButton={pageNb == pageAmount? true: false} hidePrevButton={pageNb == 1? true: false} style={{marginLeft: "50%"}}/>}
      
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default ProductsList;
