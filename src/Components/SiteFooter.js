import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Images/tire_logo.png';
import { useTranslation } from "react-i18next";

const SiteFooter = () =>{
    const { t } = useTranslation();

    return(
        <div class="footer container footer">
            <div class="row">
                <div class="col-sm-4">
                    <img src={logo} alt="logo" width={32} height={32}/> <br/>
                    CANADA WIDE CAR PARTS
                </div>
                <div class="col-sm-4">
                    <p class="footerTitles">{t("contact_footer")}</p>
                    <p>514-123-1234<br/>
                    cwcp@canadawidecarparts.tech</p>
                </div>
                <div class="col-sm-4">
                    <p class="footerTitles">{t("product_type")}</p>
                    <a href="/categories/69f852ca-625b-11ee-8c99-0242ac120002/products">{t("Brakes")} </a><br/>
                    <a href="/categories/2000c983-f63d-4b48-9ef4-df76855f5fd8/products">Suspensions </a> <br/>
                    <a href="/categories/2000c983-f63d-4b48-9ef4-df76855f5f10/products">{t("engine")} </a><br/>
                    <a href="/categories/2000c983-f63d-4b48-9ef4-df76855f5f11/products">Batteries</a>
                </div>
                {/* <div class="col-sm-3">
                    <p class="footerTitles">INFORMATION</p>
                    <p>{t("about_us")}</p>
                </div> */}
            </div>
        </div>
    );
}

export default SiteFooter;