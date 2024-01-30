import Sidebar from '../Components/SideBar_admin';
import '../styles/Contents.css';
import '../styles/Sidebar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { APIBaseUrl } from '../Components/Constants';

const AddEmployee = () => {
    const navigate = useNavigate();

    const addEmployee = (employee)=>{
        fetch(`${APIBaseUrl}/cwcp/security/employees`, { method: "POST",
            
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
        .then(navigate('/admin/employees'));
        //Create a toast, if toast doesn't show bc of redirect don't redirect
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
        addEmployee({"email": email, "fName": firstname, "lName": lastName, "password": password});
    }

    return(
        <div className='admin-css'>
            <header className='admin-header'>
            <h1>Admin Page</h1>
            </header>
            <div className="admin-container">
            <Sidebar />
                <div className="content">
                    <h2 className="add-employee">Add Employee</h2>
                    <form onSubmit={formSubmit} className="add-employee-table">
                        <label for="fName">First Name</label> <br/>
                        <input type='text' placeholder="First Name" id="fName" minLength={3} maxLength={30} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}} required={true}/> <br/>
                        <label for="lName">Last Name</label> <br/>
                        <input type='text' placeholder="Last Name" id="lName" minLength={3} maxLength={30} required={true} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <label for="email">Email</label> <br/>
                        <input type='email' placeholder="Email" id="email" required={true} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <label for="pword">Password</label> <br/>
                        <input type='password' placeholder="Password" id="pword" required={true} style={{backgroundColor:"#e7e4e4", border:0, boxShadow:"1px 1px 2px 1px #6A6A6A", borderRadius:2}}/> <br/>
                        <input type="submit" value="Save" style={{background:"rgb(17, 206, 17)", color:'white', marginTop:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold'}} id="submitEmployee"/>
                        <Button as={Link} to="/admin/employees" style={{background:"rgb(159, 160, 159)", color:'white', marginLeft:"5%", borderRadius:7, padding:"2px 25px", fontWeight:'bold', border:0}}>Cancel</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;