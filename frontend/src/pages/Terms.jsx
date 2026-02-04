// frontend/src/pages/Terms.jsx
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <div className={styles.pageContainer}>
      <h1>Terms of Service</h1>
      <p className={styles.updated}>Last updated: February 4, 2026</p>
      
      <p>
        These Terms of Services ("Terms") govern your access to and use of ClassPulse and its related services. By using ClassPulse, you agree to be bound by these Terms.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 18 years old to use ClassPulse. By creating an account, you represent that you are legally permitted to enter into these Terms.
      </p>

      <h2>Account Responsibilities</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for all activity that occues under your account. You agree to notify us immediately of any unauthorized use. 
      </p>

      <h2>Acceptable Use</h2>
      <p>
        You agree not to misuse the Service. This includes, but is not limited to:
      </p>
      <ul>
        <li>Attempting to gain unauthorized access to the Service or systems</li>
        <li>Uploading malicious code or disrupting platform functionality</li>
        <li>Using the Service for unlawful or harmful purposes</li>
        <li>Violating applicable laws or regulations</li>
      </ul>

      <h2>Educational Data</h2>
      <p>
        ClassPulse is intended for educational use. You are responsible for ensuring that any data you enter into the service, including student information, complies with applicable privacy and education laws.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The Service, including its design, code, and content, is owned by ClassPulse and is protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission.
      </p>

      <h2>Service Availability</h2>
      <p>
        We strive to help ClassPulse available and reliable, but we do not guarantee uninterrupted or error-free operation. We may update, modify, or discontinue parts of the Service at any time.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate your access to the Service if you violate these Terms or misuse the platform. You may stop using the Service at any time.
      </p>

      <h2>Disclaimer</h2>
      <p>
        ClassPulse is provided "as is" and "as available" without warranties of any kind. Your use of the Service is at your own risk. 
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, ClassPulse shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. 
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after changes become effective constitutes acceptance of the updated Terms. 
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about these Terms, please contact us at:
        <br />
        <strong>Email:</strong> support@classpulse.app
      </p>
    </div>
  );
};

export default Terms;
