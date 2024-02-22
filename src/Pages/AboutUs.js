import 'bootstrap/dist/css/bootstrap.min.css';
//import 'https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css';
//import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/monokai-sublime.min.css';
import SiteHeader from '../Components/SiteHeader';
import SiteFooter from '../Components/SiteFooter';
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { APIBaseUrl } from '../Components/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About = () => {
  const { t } = useTranslation();

  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: '',
  });

  const handleSend = (e)=>{
    e.preventDefault();
    sendEmail();
    setEmailContent({
      subject: '',
      message: '',
    });
    document.getElementById("email-form").reset();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailContent((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  async function sendEmail() {
    fetch(`${APIBaseUrl}/mail/customer-help`, {
      method: 'POST',
      body: JSON.stringify({
        subject: emailContent.subject,
        message: emailContent.message,
      }),

      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => {
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        toast.success("Email sent!" , {
          position: "top-right"
        });
    })
    .catch(error => {
      toast.error("There was a problem while sending the email", {
        position: "top-right"
      });
    });
  }

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
              <form onSubmit={handleSend} id='email-form'>
                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subject" name="subject" placeholder='Subject' onChange={handleInputChange} required />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" rows="4" placeholder='Message' onChange={handleInputChange} required></textarea>

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
