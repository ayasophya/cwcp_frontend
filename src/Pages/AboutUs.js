import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/monokai-sublime.min.css';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      <header>
        <SiteHeader/>
      </header>
      <main class="diagonal-split-background">
        <h1><bold>Contact Us </bold></h1>
        <div>
          <p>Here at Canada Wide Car Parts, our priority is to ensure you get the best possible service. </p>
          <p>Need some help? Let us know!</p>
          

          <div className='about-parent'>
            <div class="about-container left-container">
              <h1>Give us a Call</h1>
              <h3>514-123-1234</h3>
            </div>
            <div className='about-container right-container'>
              <h1>Send an Email</h1>
              <form>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder='Subject' required />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" rows="4" placeholder='Message' required></textarea>

                <button type="submit">Send Email</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <footer class="footer">
        <SiteFooter/>
      </footer>
    </div>
  );
};

export default About;
