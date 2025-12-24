// src/components/layout/NavBar.jsx
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';

function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let timeout = null;
        const onScroll = () => {
            if (!timeout) {
                timeout = setTimeout(() => {
                    setScrolled(window.scrollY > 4);
                    timeout = null;
                }, 50);
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <h1 className={styles.title}>ClassPulse</h1>
        </nav>
    )
};

export default NavBar;