import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import ShowToastMessage from '../components/ShowToastMessage';
import '../styles/login.scss';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const token = response?.user?.accessToken;
      Cookies.set('token', token, { expires: 1 });
      setIsLoading(false);
      navigate('/gallery');
    } catch ({ ...error }) {
      // Handle login error
      const message = error.code.split('/')[1].replace(/-/g, ' ');
      ShowToastMessage(message, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='form-container'>
        <h2>Welcome To Image Gallery🎉</h2>
        <p>Login to continue</p>
        <form onSubmit={handleLogin}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit' disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div>
          <p>Don't have an account?</p>
          <p>
            <Link to='/signup'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
