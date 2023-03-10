# <strong>Codewarts 🏰 </strong>

<div style="font-size: 20px">코드와트는 알고리즘 문제 풀이에 특화된 온라인 모같코 플랫폼입니다.</div><div style="font-size: 12px">*모같코 : 모여서 같이 코딩하기</div>
<img width="100vw" src="~@source/client/public/assets/readme/room_map.png">
<div style="font-size: 16px">친구들과 함께 실시간으로 코드를 치며 알고리즘 문제를 맞혀보세요!
<a href="https://codewarts.store">&nbsp; 👉🏻 코드와트로 날아가기</a></div>
<br><br>

<h2><strong>KEY FEATURE 🪄 </strong></h2>

<hr>

<div style="font-size: 20px">1.실시간 공동 편집 코드 에디터</div>
컴파일도 가능
<div><img width="40vw" src="~@source/client/public/assets/readme/editor_record.gif"></div>
<div style="font-size: 20px">2. 알고리즘 문제 제공 및 채점</div>
에디터 내 검색 기능으로 문제를 불러올 수 있어요. 문제 정보를 읽으며 알고리즘 문제를 풀고, 잘 풀었는지 채점도 해보세요!
<div><img width="40vw" src="~@source/client/public/assets/readme/algorithm_record.gif"></div>
<div style="font-size: 20px">3. 실시간 그림판</div>
실시간으로 코드를 보며 그려보세요.
<div><img width="40vw" src="~@source/client/public/assets/readme/whiteboard_record.gif"></div>
<div style="font-size: 20px">4. 실시간 음성 채팅</div>
강의실과 에디터에서 음성 채팅이 가능합니다! 함께 이야기해보세요.
<div style="font-size: 20px">5. 게시판 (리더보드 및 메모)</div>
코드와트 학생들의 코딩 랭킹을 확인하고 의지를 불태울 수 있어요! 
알고리즘 스터디를 지속해보세요!
<div><img width="100vw" src="~@source/client/public/assets/readme/main_board.png"></div>
<br><br>
<h2><strong>STACKS 📚 </strong></h2><hr>

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" >
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/phaser-3178C6?style=for-the-badge&logo=phaser&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/socket.io-white?style=for-the-badge&logo=socket.io&logoColor=010101">
<img src="https://img.shields.io/badge/mongodb-000000?style=for-the-badge&logo=mongodb&logoColor=47A248">
<img src="https://img.shields.io/badge/css-000000?style=for-the-badge&logo=css&logoColor=47A248">
<img src="https://img.shields.io/badge/html-000000?style=for-the-badge&logo=html&logoColor=47A248">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">
<img src="https://img.shields.io/badge/codemirror-D30707?style=for-the-badge&logo=codemirror&logoColor=white">

<br><br>

<h2><strong>Team Codewarts 🧑‍🤝‍🧑 </strong></h2><hr>
김준철 이은민 염혜지 김세희 한동훈 + Github 링크
<br><br>

<h2><strong>How to start ❓ </strong></h2><hr>

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

<br><br>

<h2><strong>License</strong></h2><hr>
<div>캐릭터 이미지 : Wayward</div>
<div>배경음악 : 
https://gongu.copyright.or.kr/gongu/wrt/wrtCl/listWrtSound.do?menuNo=200020 </div>
<div style="font-size: 12px">* 공유마당에 게시된 음원을 합법적으로 사용하기 위한 출처입니다.</div>

<div>bgm1 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13073758&menuNo=200020</div>
<div>bgm2 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13048800&menuNo=200026</div>
<div>bgm3 : https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13073793&menuNo=200020</div>
