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
- [CloudFlare Turnstile](https://www.cloudflare.com/ko-kr/products/turnstile/)
- [Google Analytics Link](https://analytics.google.com/analytics/web/)
- [KaKao Login](https://developers.kakao.com/product/kakaoLogin)
- [Google OAuth](https://cloud.google.com/apigee/docs/api-platform/security/oauth/oauth-home?hl=ko)
- [Github OAuth](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Naver OAuth](https://developers.naver.com/docs/login/api/api.md)


```text
NEXT_PUBLIC_SERVER=http(s):// + Spring Server Domain
NEXT_PUBLIC_DOMAIN=NextJS Public Domain
NEXT_PUBLIC_CDN_SERVER=http(s):// + CDN Server Url
NEXT_PUBLIC_CDN_SERVER_HOST=CDN Server Url
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_TURNSTILE_PRIVATE_KEY=
NEXT_PUBLIC_SSL=TRUE
NEXT_PUBLIC_GID1=Google Analytics GID
NEXT_PUBLIC_VERSION=__ANAMENSIS_VERSION__
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_KAKAO_CLIENT_ID=
NEXT_PUBLIC_KAKAO_CLIENT_SECRET=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_NAVER_CLIENT_ID=
NEXT_PUBLIC_NAVER_CLIENT_SECRET=
NEXTAUTH_SECRET=custome_secret
NEXTAUTH_URL=http(s):// + NextJS Domain (Redirect Domain)
```