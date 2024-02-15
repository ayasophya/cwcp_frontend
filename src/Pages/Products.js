import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { APIBaseUrl, CarDetails } from '../Components/Constants';
import Pagination from '@mui/material/Pagination';
import { forIn } from 'lodash';
import { useTranslation } from "react-i18next";
import SidebarFilters from '../Components/SidebarFilters';


const ProductsList = () => {
  const { t } = useTranslation();

  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  const storedCategoryId = localStorage.getItem('categoryId');
  
  const [material, setMaterial] = useState('');
const [position, setPosition] = useState('');

const applyFilters = () => {
  handleFilterSubmit(); 
};

  const [filterClicked, setFilterClicked] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false); 

  const [pageNb, setPageNb] = useState(1);
  const [pageAmount, setPageAmount] = useState(1);
  const itemsPerPage = 4;
  const [sortBy, setSortBy] = useState('');

  const [make, setMake] = useState(
    localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).make : ''
  );
  const [model, setModel] = useState(
    localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).model : ''
  );
  const [year, setYear] = useState(
    localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).year : ''
  );
  const [exist, setExist] = useState(
    localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).exist : false
  );

  useEffect(() => {
    if (query) {
      setIsSearchVisible(true);
      console.log("query is:", query, "categoryid is: ", `${storedCategoryId}`)
      if (storedCategoryId && make && model && year) {

        fetchSearchCategoryAndQueryAndFilters(query, storedCategoryId, make, model, year);
        console.log("FETCH SEARCH CATEGORY FILTERED, query is:", query, " ", storedCategoryId)
      }
      else if (storedCategoryId) {

        fetchSearchCategoryAndQuery(query, storedCategoryId);
        console.log("FETCH SEARCH CATEGORY GLOBAL, query is:", query, " in fetchFilteredSearch: " , storedCategoryId)
      }

        else if(make && model && year) {
          fetchFilteredSearchedProducts(query, make, model,year);
          console.log("query is:", query, " in fetchFilteredSearch: " , make, model , year)

      }
       else {
        fetchAllSearchedProducts(query);
        console.log("query is:", query, " in fetch ALL searched products: ", make, model, year)

      }
    } 
    else if(make && model && year){
      const url = `${APIBaseUrl}/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
      fetch(url)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
        console.log("in filtering and catId: ", categoryId)
    }
    else {
      setIsSearchVisible(false);
        fetchAllProducts();
    }
    configurePagination();
  }, [query, categoryId, make, model, year]);

  const fetchAllProducts = () => {
      fetch(`${APIBaseUrl}/categories/${categoryId}/products`)
          .then(response => response.json())
          .then(data => setProducts(data))
          .then(() => listOfProducts())
          .catch(error => console.error('Error fetching products:', error));
      
      configurePagination();
  }

      //FETCH GLOBAL SEARCH PRODUCTS
  const fetchAllSearchedProducts = (searchQuery) => {
      fetch(`${APIBaseUrl}/categories/products/search?searchQuery=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
      configurePagination();
    }

    //FETCH GLOBAL BY CATEGORYID 
    const fetchSearchCategoryAndQuery = (searchQuery, categoryId) => {
      const storedCategoryId = localStorage.getItem('categoryId');
      fetch(`${APIBaseUrl}/categories/products/search?searchQuery=${encodeURIComponent(searchQuery)}&inventoryId=${storedCategoryId}`)
      .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
  
      configurePagination();
    }
    //FETCH GLOBAL BY CATEGORYID 
    const fetchSearchCategoryAndQueryAndFilters = (searchQuery, categoryId, make, model, year) => {
      const storedCategoryId = localStorage.getItem('categoryId');
      fetch(`${APIBaseUrl}/categories/products/search?searchQuery=${encodeURIComponent(searchQuery)}&inventoryId=${storedCategoryId}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`)
      .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
  
      configurePagination();
    }

    //FETCH FILTERED SEARCH PRODUCTS
  const fetchFilteredSearchedProducts = (searchQuery, make, model, year) => {
    fetch(`${APIBaseUrl}/categories/products/search?searchQuery=${encodeURIComponent(searchQuery)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`)
    .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    configurePagination();
  }

  useEffect(() => {
    if (filterClicked) {
      if (make === '' && model === '' && year === '' && !exist) {
        fetchAllProducts();
      }
      else {
             
        const url = `${APIBaseUrl}/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
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
    if (event) event.preventDefault();
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

        const url = `${APIBaseUrl}/categories/${categoryId}/products/search?searchQuery=${encodeURIComponent(searchQuery)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts([data]);

      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setFilterClicked(true);
      setIsFilterApplied(make || model || year);
     

      const url = `${APIBaseUrl}/categories/${categoryId}/products/filter?make=${make}&model=${model}&year=${year}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts([...data]);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    let url = `${APIBaseUrl}/categories/${categoryId}/products/filter?`;

    
    if (make) {
        url += `make=${encodeURIComponent(make)}&`;
    }
    if (model) {
        url += `model=${encodeURIComponent(model)}&`;
    }
    if (year) {
        url += `year=${encodeURIComponent(year)}&`;
    }

    
    if (material) {
        url += `material=${encodeURIComponent(material)}&`;
    }
    if (position) {
        url += `position=${encodeURIComponent(position)}&`;
    }

    
    url = url.replace(/&$/, "").replace(/\?$/, "");

    try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data); 
        configurePagination(); 
        setIsSearchVisible(true); 
    } catch (error) {
        console.error('Error fetching filtered products:', error);
    }
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

  const configurePagination = () => {
    setPageAmount(Math.ceil(products.length / itemsPerPage));
  }
  


  const listOfProducts = () => {
    const translateProductName = (productName) => {
      const brakePadsRegex = /brake\s+pads/i;
      const brakeShoeRegex = /brake\s+shoe/i;
      const frictionFormulaRegex = /unique\s+friction\s+formula/i;
  
      if (brakePadsRegex.test(productName)) {
        return productName.replace(brakePadsRegex, t('brake_pads'));
      } else if (brakeShoeRegex.test(productName)) {
        return productName.replace(brakeShoeRegex, t('brake_shoe'));
      } else if (frictionFormulaRegex.test(productName)) {
        return t('friction');
      } else {
        return productName;
      }
    };
  
    if (!Array.isArray(products)) {
      console.error('Products is not an array');
      return null;
    }
  
    const newArr = pageAmount === pageNb 
      ? products.slice((pageNb * itemsPerPage) - itemsPerPage, products.length)
      : products.slice((pageNb * itemsPerPage) - itemsPerPage, pageNb * itemsPerPage);
  
    return newArr.map(product => (
      <Card key={product.internalCode} className="mb-3">
        <Card.Body>
          <Card.Img variant="top" src={product.imageLinks[0]} alt={product.name} />
          <Card.Title>
            <Link to={`/categories/${product.inventoryId}/products/${product.internalCode}`}>
              {translateProductName(product.name)}
            </Link>
          </Card.Title>
          <p>{product.price} CA$</p>
        </Card.Body>
      </Card>
    ));
  };
  

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

    fetch(`${APIBaseUrl}/categories/${categoryId}/products/price_sort_high_to_low`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }

  const fetchProductsLowToHigh = () => {
    fetch(`${APIBaseUrl}/categories/${categoryId}/products/price_sort_low_to_high`)
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
      <SiteHeader />
      <h2 className="mb-4">{isSearchVisible
          ? `Search results for "${query}" for ${make} ${model} ${year}`
          : t("products_msg")}</h2>
          
          <SidebarFilters setMaterial={setMaterial} setPosition={setPosition} onApplyFilters={applyFilters}/>

                <div className="container">   
                <label htmlFor="sortSelect"></label>
                <select
                  className="custom-select"
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">{t("sort_msg")}</option>
                  <option value="lowToHigh">{t("priceLH")}</option>
                  <option value="highToLow">{t("priceHL")}</option>
                </select>
                </div>
      <div className="card-container">
      {products.length === 0 ? (
          <p>{t("products_err")} </p>
        ) : (
          listOfProducts()
        )}
      </div>

      {products.length > 0 && <Pagination count={pageAmount} size="small" page={pageNb} onChange={onPageChange} disabled={pageAmount === 1? true: false}
      hideNextButton={pageNb === pageAmount? true: false} hidePrevButton={pageNb === 1? true: false} style={{marginLeft: "50%"}}/>}
      
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default ProductsList;
