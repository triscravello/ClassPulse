import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Alert from '../common/Alert';
import styles from './LoginForm.module.css';

const LoginForm = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // For Alert
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data;
            login(user, token); 
            console.log('Logged in user:', user);
            console.log('Token:', token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = `border p-2 rounded-full w-full ${styles.input} ${error ? styles.inputError : ''}`;

    return (
        <div>
            {error && <Alert className={styles.errorText} type="error" message={error} />}
            
            <form className={`bg-white p-6 rounded-xl shadow space-y-4 ${styles.card}`} onSubmit={handleSubmit}>
                <label className='sr-only' htmlFor='email'>
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={!!error}
                    className={inputClasses}
                />

                <label className='sr-only' htmlFor='password'>
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-invalid={!!error}
                    className={inputClasses}
                />
                <button 
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? styles.submitBtnLoading : ''}${styles.submitBtn}`} 
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
        
    );
}

export default LoginForm;