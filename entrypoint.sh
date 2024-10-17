#!/bin/bash

npm start &

java -Djava.net.preferIPv4Stack=true \
     -DJWT_SECRET_KEY=$(cat /run/secrets/jwt_secret) \
     -jar /app.jar &

wait -n

exit $?