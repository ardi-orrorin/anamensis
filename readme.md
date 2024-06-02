# Project Anamensis(업데이트 중...)

## Introduce

## Tech Skills

### Client
- Language : Typescript
- PackageManager : NPM
- Build : TurboPack
- Framework : NextJS
- Libraries
  - Date : momentJs
  - fetchAPI : axios
  - 스타일 : tailwind
  - 문법 및 오류 체크 : ESLint
- Test
  - 미정

### Server-Common Info
- Language : Java 21
- PackageManager & Build : Gradle
- Framework : Springboot
- Libraries
  - Webflux
  - SpringSecurity
  - Mybatis
  - SpringValidation
  - Lombok
  - SpringActuator
  - SpringMail
  - AwsSES

### Resource-Server
- Libraries
  
- Test
  - Junit

### Batch-Server
- Libraries
  - SpringBatch
  - SpringQuartz

### Database
- RDBMS : Mysql 8.0.36
- DBMS : Redis ?

### CI / CD
- Github Action
- Docker


## ERD --> [Link](https://www.erdcloud.com/d/kaLkfNKiwKcPe85k4)
![](./resource/erd.jpg)


## JKS 인증키 생성 방법
```shell
keytool -genkeypair -alias 'alias' -keyalg RSA \
-dname "CN=Web Server,OU=Unit,O=Organization,L=City,S=State,C=US" \
-keypass 'secret' -keystore 'file.jks' -storepass 'password'
```
