# Codeuk-Codeuk

## How to start

1. **client 디렉토리로 이동해서(cd client), npm install**
2. **server 디렉토리로 이동해서 npm install**
3. **client 디렉토리 아래에 .env 파일 생성**

   생성하지 않아도 작동은 함. 생성 안할 시 기본 모드로 동작(처음 로그인 화면부터 시작)

   env 파일 양식은 /client/env.txt 참고

4. **server 디렉토리 아래에 .env 파일 생성**

   env 파일 양식은 /server/env.txt 참고

5. **server와 client 실행**

   server : npm run dev
   python servers/scrapingserver/app.py => 플라스크 서버

   client : npx y-websocket => 에디터 웹소켓 서버
   npm start
