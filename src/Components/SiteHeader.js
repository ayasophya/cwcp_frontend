import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png';
import logo from './Images/tire_logo.png';
import cart from './Images/shopping_cart.png';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { APIDomain } from './Constants';


const SiteHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(Cookies.get('isAuthenticated')) || false
    })
    useEffect(() => {
        setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
    }, [isAuthenticated])

    useEffect(() => {
        console.log('isAuthenticated: ' + Cookies.get('isAuthenticated'))
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            console.log(
                'isAuthenticated: ' + Boolean(Cookies.get('isAuthenticated'))
            )
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
        console.log('isAuthenticated: ' + isAuthenticated)
    }, [isAuthenticated])

    const [userId, setUserId] = useState(() => {
        return Cookies.get('userId') 
    })
    useEffect(() => {
        setUserId(Cookies.get('userId'))
        console.log('userId: ', userId)
    }, [userId])

    useEffect(() => {
        console.log('isAuthenticated: ' + Cookies.get('isAuthenticated'))
        if (Cookies.get('isAuthenticated') === undefined) {
            setIsAuthenticated(false)
        } else {
            console.log(
                'isAuthenticated: ' + Boolean(Cookies.get('isAuthenticated'))
            )
            setIsAuthenticated(Boolean(Cookies.get('isAuthenticated')))
        }
        console.log('isAuthenticated: ' + isAuthenticated)
    }, [isAuthenticated])

    useEffect(() => {
        console.log("Current userId: " + userId)
    }, [userId]);

    const handleUserInfo = () => {
        if(userId){
            navigate(`/user/accountDetails/${userId}`);
        }
        else{
            window.location.href = `${APIDomain}/oauth2/authorization/okta`;
        }
    };

    const handleShoppingCart = () => {
        navigate(`/user/shopping-cart`);
    };

    useEffect(() => {
        console.log("Currently: " + isAuthenticated)
    }, [isAuthenticated]);


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
                             Logout
                         </button>
                     </form></div>) : (
                            <a href={`${APIDomain}/oauth2/authorization/okta`}>Login</a>
                            
                        )}
                    </div>
                    <div className='col-sm'>
                        <img src={cart} width={75} height={50} alt="Shopping cart default icon" onClick={handleShoppingCart}/>
                    </div>
                </div>
            </div>
      <nav style={{ float: 'clear' }}>
        <a href="/">Home</a> &nbsp;
        <a href="#">Products</a> &nbsp;
        <a href="/Categories">Categories</a> &nbsp;
        <a href="#">Contact</a>
        <div className='filter-and-search'>
        <div className='filter-nav-section'>

        <form onSubmit={handleFilterSubmit}>
                <select className="custom-select" value={make} onChange={e => setMake(e.target.value)}>
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

                <button type="submit" className="custom-button" id="saveBtn">Save Car</button>
                {(make || model || year) && (
                    <button type="button" className="custom-button" onClick={handleClearFilter}>Clear Vehicle</button>
                )}
            </form>
            <div className='search-bar-nav'>
            <form onSubmit={handleSearchSubmit} className='form-css'>
                <input
                    type="text"
                    placeholder="Search by name or part number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="submit" className='custom-button'>Search</button>
                </form> 
                </div>
        </div>
        </div>   
      </nav>
    </div>
  );
};

export default SiteHeader;
