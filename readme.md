# Project Anamensis


## ERD --> [Link](https://www.erdcloud.com/d/kaLkfNKiwKcPe85k4)
![](./resource/erd.jpg)

## docker create secret
- application.yml

```shell
docker secret create config_anamensis_secret_config config-config.yml
docker secret create batch_anamensis_secret_config batch-config.yml
```

## docker build
- docker build & deploy
- service : site(nextjs + server), batch, config, base
- port : service port
- docker_hub_id : docker hub id 혹은 docker registry id
- base_id : docker build base Docker Image
```shell
#build, site, batch, config
/root/build.sh service version docker_hub_id base_id

#build base
/root/build.sh base version docker_hub_id

```
- example build & deploy
```shell
#site build
./build.sh site 0.0.40 anamensis anamensis

#base build
/root/build.sh base 0.0.1 anamensis
```

## NextJs Environments
- NEXTAUTH_SECRET (필수값)

## Spring Server Environments
- DB_URI (필수, 기본값: localhost:5432/anamensis)
- DB_USERNAME (필수값: postgres)
- DB_PASSWORD (필수값)
- DB_MAX_POOL_SIZE (기본값: 21)
- JWT_SECRET_KEY (필수값)
- FILE_STORAGE_DIR (기본값: /)
- AWS 설정
  - AWS_S3_ACTIVE (기본값: false)
  - AWS_ACCESS_KEY  (AWS 설정 시 필수값, 기본값 없음)
  - AWS_SECRET_KEY (AWS 설정 시 필수값, 기본값 없음)
  - AWS_REGION (기본값: ap-northeast-2)
  - AWS_BUCKET (기본값: anamensis)

## Init User
```text
Default User
ID: master
PASSWORD: master
```