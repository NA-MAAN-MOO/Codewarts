import { createContext, ReactNode, useState } from 'react';
import chars from 'assets/characters';

interface ICharacters {
  [key: string]: string;
}

const characters = chars as ICharacters;

interface ISignContext {
  isSignUpOpen: boolean;
  signUpFailMsg: string;
  openSignUpForm: () => void;
  closeSignUpForm: () => void;
  handleSignUpFailMsg: (str: string) => void;
  avatarIndex: number;
  handleAvatarIndex: (num: number) => void;
  avatars: { name: string; img: string }[];
}

export const SignContext = createContext<ISignContext>({
  isSignUpOpen: false,
  signUpFailMsg: '',
  openSignUpForm: () => {},
  closeSignUpForm: () => {},
  handleSignUpFailMsg: () => {},
  avatarIndex: 0,
  handleAvatarIndex: () => {},
  avatars: [],
});

const SignContextProvider = ({ children }: { children: ReactNode }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signUpFailMsg, setSignUpFailMsg] = useState('');
  const [avatarIndex, setAvatarIndex] = useState<number>(0);

  const openSignUpForm = () => {
    setIsSignUpOpen(true);
  };
  const closeSignUpForm = () => {
    setIsSignUpOpen(false);
  };

  const handleSignUpFailMsg = (str: string) => {
    setSignUpFailMsg(str);
  };

  const handleAvatarIndex = (num: number) => {
    setAvatarIndex(num);
  };

  return (
    <SignContext.Provider
      value={{
        isSignUpOpen,
        signUpFailMsg,
        openSignUpForm,
        closeSignUpForm,
        handleSignUpFailMsg,
        avatarIndex,
        handleAvatarIndex,
        avatars: Array.from(new Array(28), (d, idx) => ({
          name: `char${idx}`,
          img: characters[`char${idx}`],
        })),
      }}
    >
      {children}
    </SignContext.Provider>
  );
};

export default SignContextProvider;
