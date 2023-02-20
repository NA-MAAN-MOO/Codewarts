import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from 'react-hook-form';

export default function FormDialog() {
  const [openSignUpForm, setOpenSignUpForm] = React.useState(false);

  const handleClickOpen = () => {
    setOpenSignUpForm(true);
  };

  const handleClose = () => {
    setOpenSignUpForm(false);
  };

  const submitSignUpForm = () => {
    console.log('제출');
    //db에 이미 있는 데이터인지 확인하고 이상없으면 제출..
  };

  const [userForm, setUserForm] = React.useState({
    userId: '',
    userPw: '',
    userNickName: '',
    userBaekNick: '',
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
      case 'userBaekNick':
        newUserForm.userBaekNick = value;
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
        <form onSubmit={submitSignUpForm}>
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
              label="백준 닉네임"
              type="text"
              fullWidth
              variant="standard"
              onInput={(e) => {
                handleForm(
                  'userBaekNick',
                  (e.target as HTMLInputElement).value
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button type="submit">확인</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
