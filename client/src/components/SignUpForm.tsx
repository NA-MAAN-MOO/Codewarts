import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios, { AxiosError } from 'axios';

export default function FormDialog() {
  const [openSignUpForm, setOpenSignUpForm] = React.useState(false);

  const handleClickOpen = () => {
    setOpenSignUpForm(true);
  };

  const handleClose = () => {
    setOpenSignUpForm(false);
  };

  const submitSignUpForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('제출');
    try {
      let body = {
        userId: userForm.userId,
        userPw: userForm.userPw,
        userNickname: userForm.userNickName,
        userBojId: userForm.userBojId,
        userLeetId: userForm.userLeetId,
      };
      const signUpResponse = await axios.post(
        'http://localhost:3003/user/signup',
        body
      );
      console.log(signUpResponse.data);
      if (signUpResponse.data.status === 200) {
        console.log('회원가입 성공');
        setOpenSignUpForm(false);
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        console.log('이미 존재하는 회원입니다');
      }
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
      <Button variant="outlined" onClick={handleClickOpen}>
        회원가입
      </Button>
      <Dialog open={openSignUpForm} onClose={handleClose}>
        <form onSubmit={submitSignUpForm} id="signUp">
          <DialogTitle>회원가입</DialogTitle>
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
              type="text"
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
            <Button onClick={handleClose}>취소</Button>
            <Button type="submit" form="signUp">
              확인
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
