# Codeuk-Codeuk

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

✔ 영원한 약속(永遠約束) by Rinne

🎧 Rinne

- https://www.youtube.com/channel/UCo7fO7SwKzRmm9xGxHJVhaA/videos

🎧 Download / Stream

- https://www.sellbuymusic.com/musicDetail/19242

✔ End world by Rinne

🎧 Rinne

- https://www.youtube.com/channel/UCo7fO7SwKzRmm9xGxHJVhaA/videos

🎧 Download / Stream

- https://www.sellbuymusic.com/musicDetail/19205
