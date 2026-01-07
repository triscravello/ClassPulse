import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api';
import Alert from '../common/Alert';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // General error message
  const [fieldError, setFieldError] = useState({ email: '', password: '' }); // Field-specific errors
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when user types
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(null);
    setFieldError((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
    setFieldError((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldError({ email: '', password: '' });
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      console.log('FULL LOGIN RESPONSE:', response.data);

      // Persist login
      login(user, token); // Updates context

      navigate('/dashboard');
    } catch (err) {
      // Field-specific or general error
      const msg = err.response?.data?.message;

      if (msg === 'User not found') {
        setFieldError({ email: 'Email not registered', password: '' });
      } else if (msg === 'Invalid credentials') {
        setFieldError({ email: '', password: 'Incorrect password' });
      } else if (!err.response) {
        setError('No response from server. Please try again.');
      } else {
        setError(msg || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError) =>
    `border p-2 rounded-full w-full ${styles.input} ${hasError ? styles.inputError : ''}`;

  return (
    <div>
      {error && <Alert className={styles.errorText} type="error" message={error} />}

      <form
        className={`bg-white p-6 rounded-xl shadow space-y-4 ${styles.card}`}
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
          aria-invalid={!!fieldError.email}
          className={inputClasses(!!fieldError.email)}
        />
        {fieldError.email && <p className={styles.fieldError}>{fieldError.email}</p>}

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          aria-invalid={!!fieldError.password}
          className={inputClasses(!!fieldError.password)}
        />
        {fieldError.password && <p className={styles.fieldError}>{fieldError.password}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? styles.submitBtnLoading : ''
          } ${styles.submitBtn}`}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;