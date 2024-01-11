import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';

const AddEmployee =() => {
    const addItem = (item)=>{
        fetch("http://localhost:8080/api/v1/cwcp/security/employees", { method: "POST",
            
            body: JSON.stringify({
                email: item.email,
                firstName: item.fName,
                lastName: item.lName,
                password: item.password
            }),
            
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => console.log(response));
        // .then(response => response.json())
        // .then(json => console.log(json));
    }

    const formSubmit = (event) =>{
        event.preventDefault();
        const email = event.target.elements.email.value;
        const firstname = event.target.elements.fName.value;
        const lastName = event.target.elements.lName.value;
        const password = event.target.elements.pword.value;

        event.target.elements.email.value = "";
        event.target.elements.fName.value = "";
        event.target.elements.lName.value = "";
        event.target.elements.pword.value = "";
        // if(itemC === '' || itemD === '' || itemU === ''){
        //     window.alert("You cannot add nothing to the list");
        //     return;
        // }
        addItem({"email": email, "fName": firstname, "lName": lastName, "password": password});
    }

    return(
        <div className='admin-css'>
            <header className='admin-header'>
            <h1>Admin Page</h1>
            </header>
            <div className="admin-container">
            <Sidebar />
                <div className="content">
                    <h2>Add Employee</h2>
                    <form onSubmit={formSubmit}>
                        <input type='text' placeholder="Email" id="email"/>
                        <input type='text' placeholder="First Name" id="fName"/>
                        <input type='text' placeholder="Last Name" id="lName"/>
                        <input type='password' placeholder="Password" id="pword"/>
                        <input type="submit" value="Confirm"/>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;