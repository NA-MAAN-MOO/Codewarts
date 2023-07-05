import SignContextProvider from 'contexts/SignContext';
import LoginDialog from './LoginDialog';

const Container = () => {
  return (
    <SignContextProvider>
      <LoginDialog />
    </SignContextProvider>
  );
};

export default Container;
