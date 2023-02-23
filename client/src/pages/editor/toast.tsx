import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifyOne = () => {
  toast.success(`🦄 염혜지님 성공!`, {
    position: 'top-center',
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

const notifyTwo = () => {
  toast.warning('❌ 김준철님 실패!', {
    position: 'top-center',
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

const notifyThree = () => {
  toast.success('🦄 김준철님 성공! ', {
    position: 'top-center',
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

export { notifyOne, notifyTwo, notifyThree };
