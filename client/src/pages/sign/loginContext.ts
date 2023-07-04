import { createContext, useContext, ReactNode } from 'react';

interface ISignContext {
  isSignUpOpen: boolean;
  isLoginWarnOpen: boolean;
  loginFailMsg: string;
  signUpFailMsg: string;
}

export const signContext = createContext<ISignContext>({
  isSignUpOpen: false,
  isLoginWarnOpen: false,
  loginFailMsg: '',
  signUpFailMsg: '',
});

const loginContextProvider = ({ children }: { children: ReactNode }) => {};
