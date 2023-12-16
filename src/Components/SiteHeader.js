import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from './Images/profile_icon.png'; 
import logo from './Images/tire_logo.png';

const SiteHeader = () =>{
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
                        <img src={pfp} width={50} height={50} alt="Profile picture default icon" />
                        <a href="http://localhost:8080/oauth2/authorization/okta">Login</a>
                    </div>
                </div>
            </div>
            <nav style={{float: 'clear'}}>
                <a href="/">Home</a> &nbsp;
                <a href="#">Products</a> &nbsp;
                <a href="/Categories">Categories</a> &nbsp;
                <a href="#">Contact</a>
            </nav>
        </div>
    );
}

export default SiteHeader;