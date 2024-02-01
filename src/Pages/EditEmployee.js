import Sidebar from '../Components/SideBar_admin';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState({});
    const [changePassword, setChangePassword] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        fetch(`${APIBaseUrl}/cwcp/security/user-info/${employeeId.replace("|", "%7C")}`)
          .then((response) => response.json())
          .then((data) => setEmployee(data))
          .catch((error) => console.error('Error fetching employee:', error));
      }, []);

    const updateEmployee = (employee)=>{
        const myPromise = fetch(`${APIBaseUrl}/cwcp/security/employees/${employeeId.replace("|", "%7C")}`, { method: "PATCH",            
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
        .catch((error) => console.error('Error updating employee: ' + error))
        
        toast.promise(myPromise, {
            pending: "Editing employee",
            success: "Employee successfully edited!",
            error: "There was a problem while editing the employee",
          });
        navigate('/admin/employees')
    }

    const formSubmit = (event) =>{
        event.preventDefault();
        var password = event.target.elements.pword.value;

        if(changePassword){
            if(password === ''){
                window.alert("Enter a password")
                return;
            }
        }
        else{
            if(email === '' || fName === '' || lName === ''){
                window.alert("Please fill out all fields")
                return;
            }
        }
        event.target.elements.email.value = "";
        event.target.elements.fName.value = "";
        event.target.elements.lName.value = "";
        event.target.elements.pword.value = "";

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
                        <input type='email' hidden={changePassword} placeholder="Email" id="email" value={email} pattern='^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'
                        title="Must be a valid email format" onChange={(e) => handleEmailChange(e.target.value)} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        {changePassword? <div><a id="forgotPassword" onClick={state => setChangePassword(!changePassword)}>Cancel</a> <br/> </div>:
                        <a id="forgotPassword" onClick={state => setChangePassword(!changePassword)}>Change Password</a>}
                        <label for="pword" hidden={!changePassword}>Password</label> <br/>
                        <input type='password' placeholder="Password" id="pword" hidden={!changePassword}  pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
                        title="Must contain at least one number, one uppercase, one lowercase letter, and at least 8 or more characters"
                        style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <input type="submit" value="Save" style={{background:"rgb(17, 206, 17)", color:'white', marginTop:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold'}} id="submitEmployee"/>
                        <Button as={Link} to="/admin/employees" style={{background:"rgb(159, 160, 159)", color:'white', marginLeft:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold', border:0}} id="cancelBtn">Cancel</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;