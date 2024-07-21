# Project Anamensis


## ERD --> [Link](https://www.erdcloud.com/d/kaLkfNKiwKcPe85k4)
![](./resource/erd.jpg)

## docker create secret
- application.yml 파일 및 nextjs.env secret으로 등록

```shell
docker secret create server_anamensis_secret_config server-config.yml
docker secret create config_anamensis_secret_config config-config.yml
docker secret create config_anamensis_secret_keystore keystore.jks
docker secret create batch_anamensis_secret_config batch-config.yml
docker secret create nextjs_anamensis_secret_config nextjs.env
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

## example site application.yml
```yaml
spring:
  application:
    name: server, aws, mysql, security, redis
  config:
    import: optional:configserver:https://url
  flyway: #db migration
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration/mysql
    validate-on-migrate: true
    validate-migration-naming: true
```

## example site nextjs.env
- [Google RECAPTCHA Link](https://www.google.com/recaptcha)
- [Google Analytics Link](https://analytics.google.com/analytics/web/)

```text
NEXT_PUBLIC_SERVER=http(s):// + Spring Server Domain
NEXT_PUBLIC_DOMAIN=NextJS Public Domain
NEXT_PUBLIC_CDN_SERVER=http(s):// + CDN Server Url
NEXT_PUBLIC_CDN_SERVER_HOST=CDN Server Url
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=Google ReCaptcha Site Key
NEXT_PUBLIC_RECAPTCHA_PRIVATE_KEY=Google ReCaptcha Private Key 
NEXT_PUBLIC_SSL=TRUE
NEXT_PUBLIC_GID=Google Analytics GID
NEXT_PUBLIC_VERSION=__ANAMENSIS_VERSION__
```