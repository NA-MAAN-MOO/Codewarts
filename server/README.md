## 서버 커맨드

npm run build : 코드를 js 파일로 컴파일해서 dist 디렉토리에 넣어 줌

npm run dev : node.js 서버를 개발 모드로 실행

=> tsc watch와 nodemon 동시 실행.

tsc watch : ts코드가 바뀔 때마다 자동으로 컴파일해준 뒤 js로 실행시켜 줌.

nodemon : 서버 코드를 변경할 때마다 서버를 재시작해줘야 변경사항이 적용되는데, nodemon을 사용하면 재시작을 자동으로 해줌

## 서버 디렉토리 구조

[참고 사이트](https://velog.io/@jjunyjjuny/%EB%B0%B1%EC%97%94%EB%93%9C%EB%8A%94-%EC%B2%98%EC%9D%8C%EC%9D%B4%EB%9D%BC..-3.-Express%EC%99%80-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)

`-- src
    |-- controllers
    |-- models
    |-- routes
    |-- middlewares
    `-- uitls

### controllers

routes로부터 Request, Response를 받아서 데이터를 처리하는 파일들

### models

데이터베이스의 각 스키마에 해당하는 파일들 모음

### routes

서버에 요청이 들어올 때 URI의 path에 따라 필요한 controller로 이어주는 역할

### middlewares

미들웨어를 모아두는 폴더

### utils

범용성 있고 재사용 가능한 함수들 모음
