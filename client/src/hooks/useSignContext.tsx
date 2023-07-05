import { useContext } from 'react';
import { SignContext } from 'contexts/SignContext';

export const useSignContext = () => useContext(SignContext);
