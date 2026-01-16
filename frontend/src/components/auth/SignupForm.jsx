import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api'; 
import styles from './SignupForm.module.css';
import { useNavigate } from 'react-router-dom';
import { notifySuccess, notifyError } from '../../utils/notify';
import { getErrorMessage } from '../../utils/api';

const SignupForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  }

  const strength = getPasswordStrength();
  const strengthWidth = { weak: '33%', medium: '66%', strong: '100%' }[strength];

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError({ name: '', email: '', password: '' });
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { user, token } = response.data;
      login(user, token);

      notifySuccess("Welcome! Account created successfully.");
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);

      // Map backend errors to fields
      if (msg.toLowerCase().includes('email')) {
        setFieldError(prev => ({ ...prev, email: msg }));
      } else if (msg.toLowerCase().includes('password')) {
        setFieldError(prev => ({ ...prev, password: msg }));
      } else {
        notifyError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError) =>
    `border p-2 rounded-full w-full ${styles.input} ${hasError ? styles.inputError : ''}`;

  return (
    <div className={`bg-white p-6 rounded-xl shadow ${styles.card}`}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <label className="sr-only" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={inputClasses(!!fieldError.name)}
          aria-invalid={!!fieldError.name}
          aria-describedby={fieldError.name ? "name-error" : undefined}
        />
        {fieldError.name && <p id="name-error" className={styles.fieldError}>{fieldError.name}</p>}

        {/* Email */}
        <label className="sr-only" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={inputClasses(!!fieldError.email)}
          aria-invalid={!!fieldError.email}
          aria-describedby={fieldError.email ? "email-error" : undefined}
        />
        {fieldError.email && <p id="email-error" className={styles.fieldError}>{fieldError.email}</p>}

        {/* Password */}
        <label className="sr-only" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={inputClasses(!!fieldError.password)}
          aria-invalid={!!fieldError.password}
          aria-describedby={fieldError.password ? "password-error" : undefined}
        />
        {fieldError.password && <p id="password-error" className={styles.fieldError}>{fieldError.password}</p>}

        <p className={styles.helperText}>Password must be at least 8 characters</p>

        {/* Password Strength */}
        <div className="mt-2 bg-gray-200 rounded h-2">
          <div
            className={`${styles.passwordStrength} ${styles[strength]}`}
            style={{ width: strengthWidth, height: '100%' }}
          />
        </div>
        <p className="text-sm text-gray-600">{strength.toUpperCase()}</p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-green-600 text-white px-4 py-2 rounded w-full transition transform duration-100 hover:scale-[0.98] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${styles.submitBtn}`}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;