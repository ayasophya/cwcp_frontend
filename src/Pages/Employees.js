import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { APIBaseUrl, APIDomain } from '../Components/Constants';
import { useAuth } from '../Auth/AuthService';
import { useTranslation } from "react-i18next";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const auth = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
      fetch(`${APIBaseUrl}/cwcp/security/employees`, { method: "GET",
            headers: {
                "Authorization": `bearer ${auth.getAccessToken()}`
            }
        })
        .then((response) => response.json())
        .then((data) => setEmployees(data))
        .then(() => console.log(employees))
        .catch((error) => console.error('Error fetching employees:', error));
    }, []);

    const EmployeeBox = ({employee}) => {
      return(
        <div className="inventory-item">
          <img src={employee.picture} alt="Profile" className="profile-picture"/>
          <h3>{employee.name}</h3>
          <Button as={Link} to={`/admin/editEmployee/${employee.user_id}`} className="custom-add-button" id="editEmployeeBtn"> {/*onClick={() => directToForm()}*/} 
            Edit
          </Button>
        </div>
      );
    }
    
    return (
      <div className='admin-css'>
        <header className='admin-header'>
          <h1>Admin Page</h1>
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
          </form></div>
        </header>
        <div className="admin-container">
          <Sidebar />
          <div className="content">
            <h2>Employees</h2>
            <Button as={Link} to="/admin/addEmployee" className="custom-add-button" id="addEmployeeBtn"> {/*onClick={() => directToForm()}*/} 
              Add Employee
            </Button>
  
            <div className="supplier-header-row">

            <div className="inventories-list">
              {employees.map((employee) => (
                <EmployeeBox key={employee.user_id} employee={employee} />
              ))}
            </div>

            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Employees;