import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Images/tire_logo.png';
import { useTranslation } from "react-i18next";

const SiteFooter = () =>{
    const { t } = useTranslation();

    return(
        <div class="footer container footer">
            <div class="row">
                <div class="col-sm-3">
                    <img src={logo} alt="logo" width={32} height={32}/> <br/>
                    CANADA WIDE CAR PARTS
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">{t("contact_footer")}</p>
                    <p>514-123-1234<br/>
                    cwcp@canadawidecarparts.tech</p>
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">{t("product_type")}</p>
                    <p>{t("Brakes")} <br/>
                    Suspensions <br/>
                    {t("engine")} <br/>
                    Batteries</p>
                </div>
                <div class="col-sm-3">
                    <p class="footerTitles">INFORMATION</p>
                    <p>{t("about_us")}</p>
                </div>
            </div>
        </div>
    );
}

export default SiteFooter;