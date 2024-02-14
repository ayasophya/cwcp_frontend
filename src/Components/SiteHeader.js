import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png';
import logo from './Images/tire_logo.png';
import cart from './Images/shopping_cart.png';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { APIDomain, APIBaseUrl } from './Constants';


const SiteHeader = () => {
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(Cookies.get('isAuthenticated')) || false
    })
    useEffect(() => {
        setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
    }, [isAuthenticated])

    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
    }, [userId])

    useEffect(() => {
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
    }, [isAuthenticated])

    const handleUserInfo = () => {
        if(userId){
            navigate(`/user/account-management`); // Navigate to the account management page
        }
        else{
            window.location.href = `${APIDomain}/oauth2/authorization/okta`;
        }
    };
    

    const handleShoppingCart = () => {
        navigate(`/user/shopping-cart`);
    };


//saving car details
const [make, setMake] = useState(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).make : '');
const [model, setModel] = useState(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).model : '');
const [year, setYear] = useState(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).year : '');
const [exist, setExist] = useState(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).exist : false);

const [makes, setMakes] = useState([]);
const [models, setModels] = useState([]);
const [years, setYears] = useState([]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  localStorage.setItem('carDetails', JSON.stringify({ make, model, year, exist: true }));
  window.location.reload();

};

  
  useEffect(() => {
    fetchMakes();
  }, []);
  useEffect(() => {
    setMake(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).make : '');
  }, []); 
  useEffect(() => {
    if (make) {
      fetchModels(make);
    } else {
      setModels([]);
      setYears([]);
    }
  
    setModel(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).model : '');
  }, [make]);
  useEffect(() => {
    if (model) {
      fetchYears(model);
    } else {
      setYear('');
      setYears([]);
    }
    setYear(localStorage.getItem('carDetails') ? JSON.parse(localStorage.getItem('carDetails')).year : '');
  }, [model]);

  const fetchMakes = () => {
    fetch(`${APIBaseUrl}/cars/makes`)
        .then(response => response.json())
        .then(data => {
            setMakes(data);
        })
        .catch(error => console.error('Error fetching makes:', error));
  };

    const fetchModels = (selectedMake) => {
        fetch(`${APIBaseUrl}/cars/models?make=${selectedMake}`)
            .then(response => response.json())
            .then(data => {
                setModels(data);
            })
            .catch(error => console.error('Error fetching models:', error));
    };

    const fetchYears = (selectedModel) => {
        fetch(`${APIBaseUrl}/cars/years?model=${selectedModel}`)
            .then(response => response.json())
            .then(data => {
                setYears(data);
            })
            .catch(error => console.error('Error fetching years:', error));
    };

    const handleClearFilter = () => {
    setMake('');
    setModel('');
    setYear('');
    localStorage.removeItem('carDetails');
    window.location.reload();
      };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
   

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) { 
            alert("Please enter a search query.");
            return;
        }

        try {
        
            navigate(`/categories/products/search-result/${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    return(
        <div class="header">
            <div class="container">
                <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-1" style={{textAlign: "right"}}>
                        <img src={logo} alt="logo" width={50} height={50}/>
                    </div>
                    <div class="col-sm-8">
                        <h1> CANADA WIDE CAR PARTS</h1>
                    </div>
                    <div class="col-sm">
                        <img src={pfp} width={50} height={50} alt="Profile picture default icon" onClick={handleUserInfo} />
                        {isAuthenticated ? (
                         <div> <form
                         method={'post'}
                         action={
                             `${APIDomain}/api/v1/canadawidecarparts/logout`
                         }
                         id="logoutForm"
                     >
                         <button
                             id={'submit'}
                             type={'submit'}
                         >
                             {t("logout")}
                         </button>
                     </form></div>) : (

                            <a href={`${APIDomain}/oauth2/authorization/okta`}>{t("login_msg")}</a>
                            
                        )}
                    </div>
                    <div className='col-sm'>
                        <img src={cart} width={72} height={45} alt="Shopping cart default icon" onClick={handleShoppingCart}/>
                    </div>
                </div>
            </div>
      <nav style={{ float: 'clear' }}>
        <a href="/">{t("home_msg")}</a> &nbsp;
        <a href="#">{t("products_msg")}</a> &nbsp;
        <a href="/Categories">{t("categories_msg")}</a> &nbsp;
        <a href="#">{t("contact_msg")}</a>
        <div className='filter-and-search'>
        <div className='filter-nav-section'>

        <form onSubmit={handleFilterSubmit}>
                <select className="custom-select" value={make} onChange={e => setMake(e.target.value)}>
                    <option value="">{t("sel_make")}</option>
                    {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </select>

                <select className={`custom-select ${!make || makes.length === 0 ? 'disabled-select' : ''}`} value={model} onChange={e => setModel(e.target.value)} disabled={!make || makes.length === 0}>
                    <option value="">{t("sel_model")}</option>
                    {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select className={`custom-select ${!model || models.length === 0 ? 'disabled-select' : ''}`} value={year} onChange={e => setYear(e.target.value)} disabled={!model || models.length === 0}>
                    <option value="">{t("sel_year")}</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <button type="submit" className="custom-button" id="saveBtn">{t("save_car")}</button>
                {(make || model || year) && (
                    <button type="button" className="custom-button" onClick={handleClearFilter}>{t("clear_vehicle")}</button>
                )}
            </form>
            <div className='search-bar-nav'>
            <form onSubmit={handleSearchSubmit} className='form-css'>
                <input
                    type="text"
                    placeholder={t("search_txt")}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="submit" className='custom-button'>{t("search")}</button>
                </form> 
                </div>
        </div>
        </div>   
      </nav>
    </div>
  );
};

export default SiteHeader;
