import spinner from '../assets/spinner.gif';
import '../styles/spinner.scss'

const Spinner = ({message}) => {
  return (
    <>
      <div className='spinner-container'>
        <img src={spinner} alt='spinner' />
        <p>{message}</p>
      </div>
    </>
  );
};

export default Spinner;
