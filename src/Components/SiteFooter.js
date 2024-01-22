import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Images/tire_logo.png';

const SiteFooter = () =>{
    return(
        <div class="footer container footer">
            <div class="row">
                <div class="col-sm-3">
                    <img src={logo} alt="logo" width={32} height={32}/> <br/>
                    CANADA WIDE CAR PARTS
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">CONTACT US</p>
                    <p>514-582-4293 <br/>
                    Canadawidecarparts@gmail.com</p>
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">PRODUCT TYPES</p>
                    <p>Brakes <br/>
                    Suspensions <br/>
                    Engines <br/>
                    Batteries</p>
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">INFORMATION</p>
                    <p>About Us</p>
                </div>
            </div>
        </div>
    );
}

export default SiteFooter;