import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios, { AxiosError } from 'axios';
import { styledTheme } from 'styles/theme';
import MySnackbar from './MySnackbar';
import { ThemeProvider } from '@mui/system';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

export default function FormDialog() {
  const [openSignUpForm, setOpenSignUpForm] = React.useState(false);
  const [signUpFailMsg, setSignUpFailMsg] = React.useState('');

  const handleClickOpen = () => {
    setOpenSignUpForm(true);
  };

  const handleClose = () => {
    setOpenSignUpForm(false);
  };

  const submitSignUpForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let body = {
        userId: userForm.userId,
        userPw: userForm.userPw,
        userNickname: userForm.userNickName,
        userBojId: userForm.userBojId,
        userLeetId: userForm.userLeetId,
      };
      const signUpResponse = await axios.post(
        `${APPLICATION_DB_URL}/user/signup`,
        body
      );
      if (signUpResponse.data.status === 200) {
        setSignUpSuccess(true);
        setSignUpFail(false);
        setOpenSignUpForm(false);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setSignUpFailMsg('이미 존재하는 아이디 입니다');
      } else if (error?.response?.status === 410) {
        setSignUpFailMsg('이미 존재하는 닉네임 입니다');
      } else {
        setSignUpFailMsg(
          '아이디와 닉네임은 공백과 특수기호를 포함할 수 없습니다'
        );
      }
      setSignUpFail(true);
      setSignUpSuccess(false);
    }
    return false;

    //db에 이미 있는 데이터인지 확인하고 이상없으면 제출..
  };

  const [userForm, setUserForm] = React.useState({
    userId: '',
    userPw: '',
    userNickName: '',
    userBojId: '',
    userLeetId: '',
  });

  const handleSignUpClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSignUpSuccess(false);
    setSignUpFail(false);
  };

  const [signUpSuccess, setSignUpSuccess] = React.useState<boolean>(false);
  const [signUpFail, setSignUpFail] = React.useState<boolean>(false);

  const handleForm = (item: string, value: string) => {
    let newUserForm = userForm;
    switch (item) {
      case 'userId':
        newUserForm.userId = value;
        setUserForm(newUserForm);
        break;
      case 'userPw':
        newUserForm.userPw = value;
        setUserForm(newUserForm);
        break;
      case 'userNickName':
        newUserForm.userNickName = value;
        setUserForm(newUserForm);
        break;
      case 'userBojId':
        newUserForm.userBojId = value;
        setUserForm(newUserForm);
        break;
      case 'userLeetId':
        newUserForm.userLeetId = value;
        setUserForm(newUserForm);
        break;
    }
  };

  return (
    <div>
      <MySnackbar
        text="회원가입 완료"
        state="success"
        onClose={handleSignUpClose}
        onOpen={signUpSuccess}
      />
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={handleClickOpen}
        sx={{ fontFamily: styledTheme.mainFont }}
      >
        회원가입
      </Button>
      <Dialog
        open={openSignUpForm}
        onClose={handleClose}
        sx={{ fontFamily: styledTheme.mainFont }}
      >
        <MySnackbar
          onClose={handleSignUpClose}
          text={signUpFailMsg}
          state="warning"
          onOpen={signUpFail}
        />
        <form onSubmit={submitSignUpForm} id="signUp">
          <DialogTitle sx={{ fontFamily: styledTheme.mainFont }}>
            회원가입
          </DialogTitle>
          <DialogContent>
            <TextField
              required={true}
              margin="dense"
              id="name"
              label="아이디"
              type="text"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm('userId', (e.target as HTMLInputElement).value);
              }}
            />
            <TextField
              required={true}
              margin="dense"
              id="name"
              label="비밀번호"
              type="password"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm('userPw', (e.target as HTMLInputElement).value);
              }}
            />
            <TextField
              required={true}
              margin="dense"
              id="name"
              label="닉네임"
              type="text"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm(
                  'userNickName',
                  (e.target as HTMLInputElement).value
                );
              }}
            />
            <TextField
              required={true}
              margin="dense"
              id="name"
              label="백준 ID"
              type="text"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm('userBojId', (e.target as HTMLInputElement).value);
              }}
            />
            <TextField
              margin="dense"
              id="name"
              label="LeetCode ID"
              type="text"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm('userLeetId', (e.target as HTMLInputElement).value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ fontFamily: styledTheme.mainFont }}
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ fontFamily: styledTheme.mainFont }}
              type="submit"
              form="signUp"
            >
              확인
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
