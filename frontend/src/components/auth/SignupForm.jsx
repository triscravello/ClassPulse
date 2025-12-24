import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api'; 
import Alert from '../common/Alert';
import styles from './SignupForm.module.css';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getPasswordStrength = () => {
        if (password.length < 8) return 'weak';
        if (password.length < 12) return 'medium';
        return 'strong';
    }

    const strength = getPasswordStrength();

    const strengthWidth = {
        weak: '33%',
        medium: '66%',
        strong: '100%',
    }[strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            const { user, token } = response.data;
            login(user, token);
            // Redirect to dashboard or home page
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = `border p-2 rounded-full w-full ${styles.input} ${error ? styles.inputError : ''}`;

    return (
        <div className={`bg-white p-6 rounded xl-shadow ${styles.card}`}>
            {error && <Alert type="error" message={error} />}
            
            <form onSubmit={handleSubmit} className='space-y-4'>
                <label className='sr-only' htmlFor='name'>
                    Name
                </label>
                <input
                    type="text"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClasses}
                />
                
                <label className='sr-only' htmlFor='email'>
                    Email
                </label>
                <input 
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClasses}
                />

                <label className='sr-only' htmlFor='password'>
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputClasses}
                />

                {/* Password strength bar will go here */}
                <p className={styles.helperText}>
                    Password must be at least 8 characters
                </p>
                
                <div className="mt-2 bg-gray-200 rounded">
                    <div className={`${styles.passwordStrength} ${styles[strength]}`} style={{ width: strengthWidth }} />
                </div>
                
                <button 
                    className={`bg-green-600 text-white px-4 py-2 rounded mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} ${styles.submitBtn}`} 
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>    
        </div>
        
    );
};

export default SignupForm;