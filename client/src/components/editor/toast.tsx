import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/fonts.css'; /* FONT */

const notifySuccess = (userName: string, problemId: number) => {
  toast.success(`π¦ ${userName}λ ${problemId}λ² λ¬Έμ  μ±κ³΅!`, {
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
const notifyKickedOut = (userName: string) => {
  toast.warning(`π« ${userName}λμ μλν°μμ κ°ν΄λΉνμ¨μ΅λλ€!`, {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};

const notifyFail = (userName: string, problemId: number) => {
  toast.warning(`β ${userName}λ ${problemId}λ² λ¬Έμ  μ€ν¨!`, {
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
  toast.success('π¦ κΉμ€μ² λ μ±κ³΅! ', {
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

<ToastContainer
  position="top-center"
  autoClose={9000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  style={{
    fontFamily: 'Cascadia Code, Pretendard-Regular',
  }}
/>;

export {
  notifySuccess,
  notifyFail,
  notifyThree,
  notifyKickedOut,
  ToastContainer,
};
