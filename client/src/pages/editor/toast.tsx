import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = () => {
  toast.success('🦄 김준철님 성공!', {
    position: 'top-center',
    autoClose: 9000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

export default notify;
