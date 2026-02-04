// frontend/src/pages/Privacy.jsx
import styles from './Privacy.module.css';

const Privacy = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.updated}>Privacy Policy</h1>
            <p>Last updated: February 4th, 2026</p>
            
            <p>
                ClassPulse values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you can use the ClassPulse application and related services.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information You Provide</h3>
            <p>
                When you create an account or use ClassPulse, we may collect information such as your name, email address, role (teacher), and any classroom or behavior data you choose to enter. 
            </p>

            <h3>Information Collected Automatically</h3>
            <p>
                We may automatically collect limited technical information, such as your browser type, device information, IP address, and usage activity to help us maintain security and improve the Service.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide and operate the ClassPulse Service</li>
                <li>Authenticate users and manage accounts</li>
                <li>Enable classroom tracking, planning, and reporting features</li>
                <li>Improve product functionality and user experience</li>
                <li>Communicate important updates or respond to support requests</li>
            </ul>

            <h2>Student Data</h2>
            <p>
                ClassPulse is designed for use by educators. Any student-related data entered into the platform is controlled by the educator or institution and is used solely to provide the educational features of the Service. We do not sell or use student data for advertising purposes.
            </p>

            <h2>Data Sharing</h2>
            <p>
                We do not sell your personal information. We may share data only with trusted service providers who help us operate ClassPulse (such as hosting or analytics), or when required to comply with legal obligations.
            </p>

            <h2>Data Security</h2>
            <p>
                We take reasonable measures to protect your information, including secure authentication practices and encrypted data transmission. However, no system can be guaranteed to be completely secure. 
            </p>

            <h2>Data Retention</h2>
            <p>
                We retain personal information only as long as necessary to provide the Service or comply with legal requirements. You may request deletion of your account and associated data at any time.
            </p>

            <h2>Your Rights</h2>
            <p>
                Depending on your location, you may have the right to access, update, or request deltion of your personal information. To make a request, please contact us using the information below. 
            </p>

            <h2>Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                <strong>Email:</strong> support@classpulse.app
            </p>
        </div>
    );
};

export default Privacy;