import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api';
import styles from './SignupForm.module.css';
import { notifySuccess, notifyError } from '../../utils/notify';
import { getErrorMessage } from '../../utils/api';

const SignupForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Password Strength Calculation ---
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[\W]/.test(password)) score++;
    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength();
  const strengthWidth = { weak: '33%', medium: '66%', strong: '100%' }[strength];

  // --- Dynamic Page Title ---
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sign Up - ClassPulse";
    return () => { document.title = prevTitle };
  }, []);

  // --- Focus first field with error ---
  useEffect(() => {
    if (fieldError.name && nameRef.current) nameRef.current.focus();
    else if (fieldError.email && emailRef.current) emailRef.current.focus();
    else if (fieldError.password && passwordRef.current) passwordRef.current.focus();
  }, [fieldError]);

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError({ name: '', email: '', password: '' });

    // Frontend validation
    if (name.trim().length < 2) {
      setFieldError(prev => ({ ...prev, name: 'Name must be at least 2 characters.' }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError(prev => ({ ...prev, email: 'Invalid email address.' }));
      return;
    }
    if (password.length < 8) {
      setFieldError(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { user, token } = response.data;
      login(user, token);

      notifySuccess("Welcome! Account created successfully.");
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);

      if (msg.toLowerCase().includes('email')) {
        setFieldError(prev => ({ ...prev, email: msg }));
      } else if (msg.toLowerCase().includes('password')) {
        setFieldError(prev => ({ ...prev, password: msg }));
      } else {
        notifyError(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError) =>
    `border p-2 rounded-full w-full ${styles.input} ${hasError ? styles.inputError : ''}`;

  const hasError = (field) => !!fieldError[field];

  return (
    <div className={`bg-white p-6 rounded-xl shadow ${styles.card}`}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <label className="sr-only" htmlFor="name">Name <span className='text-red-500'>*</span></label>
        <input
          id="name"
          ref={nameRef}
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={inputClasses(hasError('name'))}
          aria-invalid={hasError('name')}
          aria-describedby={hasError('name') ? "name-error" : undefined}
        />
        {hasError('name') && <p id="name-error" className={styles.fieldError}>{fieldError.name}</p>}

        {/* Email */}
        <label className="sr-only" htmlFor="email">Email <span className='text-red-500'>*</span></label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={inputClasses(hasError('email'))}
          aria-invalid={hasError('email')}
          aria-describedby={hasError('email') ? "email-error" : undefined}
        />
        {hasError('email') && <p id="email-error" className={styles.fieldError}>{fieldError.email}</p>}

        {/* Password */}
        <div className="relative">
          <label className="sr-only" htmlFor="password">Password <span className='text-red-500'>*</span></label>
          <input
            id="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={inputClasses(hasError('password'))}
            aria-invalid={hasError('password')}
            aria-describedby={hasError('password') ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {hasError('password') && <p id="password-error" className={styles.fieldError}>{fieldError.password}</p>}

        {/* Password Helper */}
        <p className={styles.helperText}>Password must be at least 8 characters</p>

        {/* Password Strength */}
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className={`${styles.passwordStrength} ${styles[strength]}`}
            style={{ width: strengthWidth, height: '100%' }}
          />
        </div>
        <p className={`text-sm mt-1 ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
          {strength.toUpperCase()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {strength === 'weak' && 'Try adding numbers, uppercase letters, or symbols.'}
          {strength === 'medium' && 'Good, but consider adding symbols.'}
          {strength === 'strong' && 'Strong password!'}
        </p>

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