FROM       __DOCKER_ID__/anamensis-base:latest
LABEL      author="ARDI"
RUN        mkdir -p /app
WORKDIR    /app

ARG        JAR
ARG        JAR_FILE=server/build/libs/${JAR}.jar

COPY       ${JAR_FILE} /app.jar

COPY       ./client/.next ./.next
COPY       ./client/next.config.mjs ./next.config.mjs
COPY       ./client/package.json ./package.json
COPY       ./client/package-lock.json ./package-lock.json
COPY       ./client/public ./public

COPY       entrypoint.sh entrypoint.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=5 CMD curl -k http://localhost:8081/actuator/health | grep UP || exit 1

RUN        npm i
RUN        chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]