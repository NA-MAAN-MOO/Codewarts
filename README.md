# 🏰 Codewarts

코드와트는 어쩌구 저쩌구 온라인 모같코 플랫폼입니다. <br>\*모같코 : 모여서 같이 코딩하기

## 🪄 KEY FEATURE

1. 실시간 공동 편집 코드 에디터
   - 컴파일도 가능
2. 알고리즘 문제 제공 및 채점
3. 실시간 그림판
4. 실시간 음성 채팅

## 📚 STACKS

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/phaser-3178C6?style=for-the-badge&logo=phaser&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/socket.io-white?style=for-the-badge&logo=socket.io&logoColor=010101">
<img src="https://img.shields.io/badge/mongodb-000000?style=for-the-badge&logo=mongodb&logoColor=47A248">
<img src="https://img.shields.io/badge/css-000000?style=for-the-badge&logo=css&logoColor=47A248">
<img src="https://img.shields.io/badge/html-000000?style=for-the-badge&logo=html&logoColor=47A248">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">

## How to start

1. **client 디렉토리로 이동해서(cd client), npm install**
2. **server 디렉토리로 이동해서(cd server), npm install**
3. **client 디렉토리 아래에 .env 파일 생성**

   생성하지 않아도 작동은 함. 생성 안할 시 기본 모드로 동작(처음 로그인 화면부터 시작)

   env 파일 양식은 /client/env.txt 참고

4. **server 디렉토리 아래에 .env 파일 생성**

   env 파일 양식은 /server/env.txt 참고

5. **server와 client 실행**

   server: npm run dev
   client: npm start

6. **voice chat deploy server 실행**

   커맨드에 다음 입력

   docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.25.0

   (개발용이기 때문에 배포 시 새로 파야 함)

bgm정보
https://gongu.copyright.or.kr/gongu/wrt/wrtCl/listWrtSound.do?menuNo=200020 공유마당에 게시된 음원을 합법적으로 사용하기 위한 출처입니다.

bgm1 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13073758&menuNo=200020
bgm2 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13048800&menuNo=200026
bgm3 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13073793&menuNo=200020
