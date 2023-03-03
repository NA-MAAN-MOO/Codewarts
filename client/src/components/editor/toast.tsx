import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/fonts.css'; /* FONT */

const notifySuccess = (userName: string, problemId: number) => {
  toast.success(`🦄 ${userName}님 ${problemId}번 문제 성공!`, {
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
  toast.warning(`🚫 ${userName}님의 에디터에서 강퇴당하셨습니다!`, {
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
  toast.warning(`❌ ${userName}님 ${problemId}번 문제 실패!`, {
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
