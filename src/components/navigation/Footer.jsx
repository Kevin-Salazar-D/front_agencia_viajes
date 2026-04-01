import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import '@/styles/Footer.css';


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Logo y descripción */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">
                <MapPin size={24} />
              </div>
              <span>ViajesFácil</span>
            </div>
            <p>Tu compañero perfecto para descubrir el mundo</p>
          </div>

          {/* Empresa */}
          <div className="footer-column">
            <h3>Empresa</h3>
            <ul>
              <li><Link to="/about">Sobre nosotros</Link></li>
              <li><Link to="/careers">Trabaja con nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="footer-column">
            <h3>Soporte</h3>
            <ul>
              <li><Link to="/help">Centro de ayuda</Link></li>
              <li><Link to="/terms">Términos y condiciones</Link></li>
              <li><Link to="/privacy">Política de privacidad</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li className="contact-item">
                <Phone size={16} />
                <span>+52 33 1234 5678</span>
              </li>
              <li className="contact-item">
                <Mail size={16} />
                <span>info@viajesfacil.com</span>
              </li>
            </ul>

            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={24} />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {year} ViajesFácil. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;