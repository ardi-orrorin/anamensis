#!/bin/bash

bun run start &

java -Djava.net.preferIPv4Stack=true -jar /app.jar &

wait -n

exit $?