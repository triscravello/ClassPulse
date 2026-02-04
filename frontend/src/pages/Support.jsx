// frontend/src/pages/Support.jsx
import styles from './Support.module.css';

const Support = () => {
  return (
    <div className={styles.pageContainer}>
      <h1>Support</h1>
      <p>
        Need help with ClassPulse? You're in the right place. Whether you're setting up your classroom, troubleshooting an issue, or have a question about features, we're happy to help. 
      </p>

      <h2>Contact Support</h2>
      <p>
        The fasted way to reach us is by email:
        <br />
        <strong>Email:</strong> support@classpulse.app
      </p>
      <p>
        Please include as much detail as possible, including what you were trying to do and any error messages you encountered.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>Who is ClassPulse for?</h3>
      <p>
        ClassPulse is designed for educators and school staff who want an efficient way to track classroom behavior and participation.
      </p>

      <h3>Is student data secure?</h3>
      <p>
        Yes. We take data security seriously and use industry-standard practices to protect all information stored in ClassPulse. Student data is never sold or used for advertising. 
      </p>

      <h3>Can I request a feature or report a bug?</h3>
      <p>
        Absolutely. We love feedback. If you have an idea for a feature or find a bug, send us an email and let us know. 
      </p>

      <h3>How do I delete my account?</h3>
      <p>
        For now, you can request account deletion by contacting support. We'll take care of the rest.
      </p>

      <h2>Response Times</h2>
      <p>
        We aim to respond to all support requests as quickly as possible, usually within 1-2 business days.
      </p>
    </div>
  );
};

export default Support;
