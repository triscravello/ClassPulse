import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api';
import styles from './LoginForm.module.css';
import { notifySuccess, notifyError } from '../../utils/notify';
import { getErrorMessage } from '../../utils/api';

const LoginForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFieldError((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFieldError((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFieldError({ email: '', password: '' });
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      login(user, token);

      console.log("Login successful, showing toast");
      notifySuccess("Welcome back!"); // ✅ Toast will now show
      navigate("/dashboard");
    } catch (err) {
      const msg = getErrorMessage(err);

      if (msg === "User not found") {
        setFieldError({ email: "Email not registered", password: "" });
      } else if (msg === "Invalid credentials") {
        setFieldError({ email: "", password: "Incorrect password" });
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
    <form
      className={`bg-white p-6 rounded-xl shadow space-y-4 ${styles.card}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="sr-only" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        required
        aria-invalid={!!fieldError.email}
        aria-describedby={fieldError.email ? "email-error" : undefined}
        className={inputClasses(!!fieldError.email)}
      />
      {fieldError.email && (
        <p id="email-error" className={styles.fieldError}>{fieldError.email}</p>
      )}

      <label className="sr-only" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
        aria-invalid={!!fieldError.password}
        aria-describedby={fieldError.password ? "password-error" : undefined}
        className={inputClasses(!!fieldError.password)}
      />
      {fieldError.password && (
        <p id="password-error" className={styles.fieldError}>{fieldError.password}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${isSubmitting ? styles.submitBtnLoading : ''} ${styles.submitBtn}`}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;