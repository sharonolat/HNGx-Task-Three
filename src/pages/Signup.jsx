import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ShowToastMessage from '../components/ShowToastMessage';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
    <>
      <div className='container'>
        <div className='form-container'>
          <h2>Welcome To Image Gallery🎉</h2>
          <p>Create an account to get started</p>
          <form onSubmit={handleSignUp}>
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
              {isLoading ? 'Loading...' : 'Create account'}
            </button>
          </form>

          <div>
            <p>Already have an account?</p>
            <p>
              <Link to='/login'>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
