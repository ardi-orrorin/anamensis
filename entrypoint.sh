#!/bin/bash
APPLICATION_PATH=application.yml
ENV_FILE_PATH=.env

if [ -f "$APPLICATION_PATH" ]; then
  java -Djava.net.preferIPv4Stack=true \
        -jar app.jar \
        --spring.config.location=application.yml &
else
  java -Djava.net.preferIPv4Stack=true \
       -DJWT_SECRET_KEY=$(cat /run/secrets/jwt_secret) \
       -jar app.jar &
fi

echo "Waiting for Spring Boot to start on port 8080..."
while ! nc -z localhost 8080; do
  sleep 1 # 1초마다 포트 확인
done
echo "Spring Boot is up and running!"

if [ -f "$ENV_FILE_PATH" ]; then
  npm start &
else
  NEXTAUTH_SECRET=$(cat /run/secrets/next_secret) npm start &
fi

wait -n

exit $?