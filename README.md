# Hackathon_team19

<div align="center">


![APP_Logo-removebg-preview (1)](https://user-images.githubusercontent.com/82308415/140622004-476a9fe2-2cd8-4432-a703-8071efc7e2a6.png)

  # Moov:E

  Info
  ***Moov:E*** 는 다양한 식재료를 조금씩 구입하길 원하는, 당신을 위해 준비된 플랫폼입니다. 학교 근처* 사람들과 원하는 식재료를 구매하고 나누어 보세요.
  배송비는 들지 않습니다. 단지, 당신이 필요한 식재료만 구입해서 요리해보세요. Moov:E는 당신의 근사한 식사를 만들어 나갑니다.
  Moov:E의 모든 활동은 필요한 양만 구매하여 지구 환경 보호에 기여합니다.
  앞으로도 Moov:E는 더 많은 사람들의 다양한 니즈를 충족하고자 도전해 나갈 것입니다.
  (* 중앙대, 숙명여대, 포항공대)
</div>

# Prologue

프로젝트에 앞서 우리는 노션을 이용하여 의견을 정리하고, 피그마를 이용하여 와이어프레임을 작성 완료하였습니다.
[Wire framing](https://www.figma.com/proto/e5cjrXPAAY1QN7RzQfalwz/Moov%3AE?node-id=164%3A636&viewport=241%2C48%2C0.1&scaling=min-zoom&starting-point-node-id=1%3A9) 




# EP1. Project Execution Environment

이 프로그램은 Kotlin android, Node.js 기반에서 작성되었습니다. 
Android 5.0 API LEVEL 21(Lollipop) 이상의 환경에서 권장됩니다.

## Server Architecture
![ServerArchitecture](https://user-images.githubusercontent.com/71129059/140627442-d305fbed-8630-4172-b49b-d081d8f10a6b.png)


```
C:.
|   index.ts
|   output.txt
|   
+---config
|       index.ts
|       
+---controller
|       authController.ts
|       index.ts
|       roomController.ts
|       
+---DTO
|       authDTO.ts
|       index.ts
|       roomDTO.ts
|       
+---library
|       cast.ts
|       date.ts
|       emailSender.ts
|       emailTemplate.ejs
|       index.ts
|       jwt.ts
|       response.ts
|       returnCode.ts
|       
+---middleware
|       auth.ts
|       index.ts
|       publicAuth.ts
|       typeCheck.ts
|       
+---models
|       Certification.ts
|       Code.ts
|       index.ts
|       Like.ts
|       Message.ts
|       MessageRoom.ts
|       Participant.ts
|       Room.ts
|       RoomCondition.ts
|       RoomInformation.ts
|       RoomOption.ts
|       RoomPeriod.ts
|       RoomPhoto.ts
|       RoomPrice.ts
|       RoomType.ts
|       User.ts
|       
+---modules
|       upload.ts
|       
+---router
|       authRouter.ts
|       index.ts
|       roomRouter.ts
|       
\---service
        authService.ts
        index.ts
        roomService.ts
```



- API docs : https://resisted-cry-04d.notion.site/API-docs-37f69a7eacdf4c4db72e5f0e35dfcfab

- erd

  ![erd](https://user-images.githubusercontent.com/71129059/140627440-98072dbc-8f87-4dd4-ae81-25d52998ff57.png)

 ### baseURL : xx.xx.xx:5000/api/v1

### **📌 공통 Request-Header**
[Authorization] JWT token

- auth API
    - `POST` /auth/signin
        - 로그인
    - `POST` /auth/signup
        - 회원가입
    - `POST` /auth/email
        - 인증번호 전송
    - `POST` /auth/code
        - 인증번호 인증
    - `GET` /auth/nickname/:nickname
        - 닉네임 중복 검사
- goods API
    - `GET` /goods
        - 식료품 리스트 불러오기
    - `GET` /goods/:genGoodsID
        - 식료품 Detail 불러오기
    - `POST` /goods/:genGoodsID/:orderingNum
        - 장바구니 담기
- basket API
    - `GET` /basket
        - 장바구니 정보 불러오기
    - `POST` /basket/:order
        - 결제하기
- staff API
    - `POST` /staff/signup
        - staff 회원가입
    - `POST` /staff/sign
        - staff 로그인
    - `POST` /staff/:fundGenID
        - 수행 완료 인증사진 첨부
- admin API
    - `POST` /admin/token
        - admin token 발급
    - `POST` /admin/:staffID/:fundGenID
        - staff - FundingGeneration 배정


# EP2. git clone, dependency 설치 및 프로젝트 실행 방법 안내

```Shell
git clone https://github.com/Unidthon/Hackathon_team19.git
yarn
yarn run test
```

# EP3. 플로우

Moov:E 서비스는 우선적으로 세 학교(중앙대, 숙명여대, 포항공대)를 중심으로 서비스가 시작될 예정입니다.

자취생의 건강을 위한 여러 가지 상품들을 제공합니다. 근처에 사는 다른 학생들과 함께 여러가지 식재료를 적은 가격으로 함께 구매해보세요! 원하는 재료를 선결제 후,
모이지 않을 경우 환불 또는 기다림을 선택할 수 있게 됩니다.

이후 물건이 도착했다는 알람이 오면 가져갈 수 있습니다.

Moov:E는 오전 시간대, 오후 시간대에 나누어 여러분이 편리한 시간대에 이용할 수 있습니다. 아침 10시까지 주문할 경우, 10t시에서 13시 사이에 배송되어 13~16시에 수령 가능합니다.
또한 오후 4시까지 주문을 완료한 상품에 대해서는 19시에서 10시(다음날) 사이에 수령 가능합니다. 

Moov:E에서 공급하는 상품 리스트와 사용법을 더욱 자세히 알고 싶으시다면 [여기](https://www.notion.so/Moov-E-3672c709be6742e3b9b14bacb8f2f972)로 들어오세요.


# EP4. 스크린샷

![jpg](https://user-images.githubusercontent.com/82308415/140622612-c04c54d3-6e1a-4a77-bb46-c2c2d4c7d395.png)


# Epilogue

본 프로젝트는 UNIDTHON 2021 참가 작품입니다. 참가자 정보는 아래를 누르면 확인할 수 있습니다.

<details>
<summary>참가자 정보</summary>
<div markdown="1">
  숙명여대 : 박경나, 변영채<br/>
  중앙대 : 정설희<br/>
  포항공대 : 김대호, 제태호
</div>
</details>
