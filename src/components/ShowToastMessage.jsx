import { toast } from 'react-toastify';

const ShowToastMessage = (message, type) => {
  message = message.charAt(0).toUpperCase() + message.slice(1);
  toast[type](message);
};

export default ShowToastMessage;
