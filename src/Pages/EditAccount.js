import React, { useState, useEffect } from 'react';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { useParams, useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';

const EditAccount = () => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            fetch(`${APIBaseUrl}/cwcp/security/user-info/${userId.replace("|", "%7C")}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching user');
                    }
                    return response.json();
                })
                .then(data => {
                    setUserInfo(data);
                    setName(data.name);
                })
                .catch(error => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchData();
    }, [userId]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSave = () => {
        fetch(`${APIBaseUrl}/cwcp/security/user-info/${userId.replace("|", "%7C")}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating user info');
                }
                navigate(`/user/accountDetails/${userId}`);
            })
            .catch(error => {
                setError(error);
            });
    };

    const formSubmit = (event) => {
        event.preventDefault();
        handleSave();
    };

    const handleCancel = () => {
        navigate(`/user/accountDetails/${userId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="App">
            <SiteHeader />
            <div className="account-details-title">
                <h2>Edit Account</h2>
                <p>Your Account / Edit</p>
            </div>
            <div className="content-container">
                <div className="account-details-container">
                    <div className="account-details-edit">
                        <p>Email: {userInfo.email}</p>
                        <label htmlFor="name">Name:</label>
                        <input required type="text" id="name" value={name} onChange={handleNameChange} />
                        <div>
                            <button className="custom-button-black" onClick={formSubmit}>Save</button>
                            <button className="custom-button-black" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <SiteFooter />
            </footer>
        </div>
    );
};

export default EditAccount;
