import Link from "next/link";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.logo}>
            <img src="/image.png" alt="ATHIX" style={{ height: "40px" }} />
          </Link>
          <p className={styles.description}>
            Meerut's premier destination for custom sports apparel, tournament kits, and high-performance gym wear. Wear The Win.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <h4 className={styles.columnTitle}>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Shop</Link></li>
            <li><Link href="/custom-builder">Custom Builder</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className={styles.footerContact}>
          <h4 className={styles.columnTitle}>Contact Us</h4>
          <ul className={styles.contactList}>
            <li>
              <Phone size={18} className={styles.icon} />
              <div className={styles.contactDetails}>
                <span><a href="tel:+918755022067" style={{ color: "inherit", textDecoration: "none" }}>+91 8755022067</a></span>
                <span><a href="tel:+919411262264" style={{ color: "inherit", textDecoration: "none" }}>+91 9411262264</a></span>
              </div>
            </li>
            <li>
              <Mail size={18} className={styles.icon} />
              <span><a href="mailto:athixsports@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>athixsports@gmail.com</a></span>
            </li>
            <li>
              <MapPin size={18} className={styles.icon} />
              <span><a href="https://maps.app.goo.gl/Y1QTCV3kGFzKgZP36" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>35-B, Street No.2, Nehru Nagar, Meerut</a></span>
            </li>
          </ul>
        </div>

        <div className={styles.footerSocial}>
          <h4 className={styles.columnTitle}>Follow Us</h4>
          <a href="https://instagram.com/athixsports" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Instagram size={24} />
            <span>@athixsports</span>
          </a>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ATHIX Sports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
