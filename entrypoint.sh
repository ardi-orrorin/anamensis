#!/bin/bash

npm run start &

java -Djava.net.preferIPv4Stack=true -Xms32m -Xmx512m -jar /app.jar &

wait -n

exit $?