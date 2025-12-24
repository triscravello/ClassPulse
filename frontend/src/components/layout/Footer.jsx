// src/components/layout/Footer.jsx
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <span>© {new Date().getFullYear()} ClassPulse</span>

                <nav className={styles.links} aria-label="Footer navigation">
                    <a href="/privacy" className={styles.link}>Privacy</a>
                    <a href="/terms" className={styles.link}>Terms</a>
                    <a href="/support" className={styles.link}>Support</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
