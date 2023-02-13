/* Component for Login dialog */

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #;
`;

//로그인 버튼을 눌렀을 때 게임 로비 신이 시작되도록
export default function LoginDialog() {
  return (
    <>
      <div>로그인하기</div>
    </>
  );
}
