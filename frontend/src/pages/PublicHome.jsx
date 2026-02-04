// frontend/src/pages/PublicHome.jsx
import { Link } from "react-router-dom";
import styles from "./PublicHome.module.css";

export default function PublicHome() {
    return (
        <main className={styles.container}>
            <img src="/logo192.png" alt="ClassPulse logo" className={styles.logo} />
            <h1 className={styles.title}>ClassPulse</h1>

            <p className={styles.subtitle}>
                Real-time insights to help teachers track classroom engagement and behavior.
            </p>

            <div className={styles.actions}>
                <Link to="/signup" className={styles.primaryButton}>Get Started</Link>
                <Link to="/login" className={styles.secondaryButton}>Log In</Link>
            </div>

            <ul className={styles.features}>
                <li className={styles.featureItem}>Track classroom behavior and participation</li>
                <li className={styles.featureItem}>View engagement trends over time</li>
                <li className={styles.featureItem}>Export reports for educators</li>
            </ul>
        </main>
    );
}