import Sidebar from '../Components/SideBar_admin';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    // const navigate = useNavigate();
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState({});
    const [changePassword, setChangePassword] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        fetch('http://localhost:8080/api/v1/cwcp/security/user-info/auth0%7C' + employeeId.slice(6))
          .then((response) => response.json())
          .then((data) => setEmployee(data))
          .then(() => console.log("Employee " + employee))
          .catch((error) => console.error('Error fetching employee:', error));
      }, []);

    const updateEmployee = (employee)=>{
        fetch("http://localhost:8080/api/v1/cwcp/security/employees/auth0%7C" + employeeId.slice(6), { method: "PATCH",            
            body: JSON.stringify({
                email: employee.email,
                firstName: employee.fName,
                lastName: employee.lName,
                password: employee.password
            }),
            
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => console.log(response))
        //.then(navigate('/admin/employees'))
        .catch((error) => console.error('Error updating employee: ' + error))
        //Create a toast, if toast doesn't show bc of redirect don't redirect
    }

    const formSubmit = (event) =>{
        event.preventDefault();
        console.log("before getting email")
        var password = event.target.elements.pword.value;

        event.target.elements.email.value = "";
        event.target.elements.fName.value = "";
        event.target.elements.lName.value = "";
        event.target.elements.pword.value = "";

        console.log("About to change");
        if(emailChanged)
            setEmail("");

        updateEmployee({"email": email, "fName": fName, "lName": lName, "password": password});
    }

    const handleEmailChange = (email) => {
        setEmail(email);
        setEmailChanged(true);
    }

    useEffect(() => {
        if(employee.name !== undefined){
            setFName(employee.name.split(" ")[0]);
            setLName(employee.name.split(" ")[1]);
            setEmail(employee.email);
        }
    }, [employee])

    return(
        <div className='admin-css'>
            <header className='admin-header'>
            <h1>Admin Page</h1>
            </header>
            <div className="admin-container">
            <Sidebar />
                <div className="content">
                    <h2 className="add-employee">Edit Employee - {employee.name}</h2>
                    <form onSubmit={formSubmit} className="add-employee-table">
                        <label for="fName" hidden={changePassword}>First Name</label> <br/>
                        <input type='text' hidden={changePassword} placeholder="First Name" id="fName" minLength={3} maxLength={30} value={fName} onChange={(e) => setFName(e.target.value)} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}} /> <br/>
                        <label for="lName" hidden={changePassword}>Last Name</label> <br/>
                        <input type='text' hidden={changePassword} placeholder="Last Name" id="lName" minLength={3} maxLength={30} value={lName} onChange={(e) => setLName(e.target.value)} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <label for="email" hidden={changePassword}>Email</label> <br/>
                        <input type='email' hidden={changePassword} placeholder="Email" id="email" value={email} onChange={(e) => handleEmailChange(e.target.value)} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        {changePassword? <div><a id="forgotPassword" onClick={state => setChangePassword(!changePassword)}>Cancel</a> <br/> </div>:
                        <a id="forgotPassword" onClick={state => setChangePassword(!changePassword)}>Change Password</a>}
                        <label for="pword" hidden={!changePassword}>Password</label> <br/>
                        <input type='password' placeholder="Password" id="pword" hidden={!changePassword} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <input type="submit" value="Save" style={{background:"rgb(17, 206, 17)", color:'white', marginTop:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold'}} id="submitEmployee"/>
                        <Button as={Link} to="/admin/employees" style={{background:"rgb(159, 160, 159)", color:'white', marginLeft:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold', border:0}}>Cancel</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;