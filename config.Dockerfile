FROM       openjdk:24-slim
RUN        apt-get update && apt-get install -y curl
LABEL      author="ARDI"
VOLUME     /tmp
ARG        JAR
ARG        JAR_FILE=config/build/libs/${JAR}.jar
COPY       ${JAR_FILE} app.jar
ENV        SPRING_CONFIG_LOCATION "/application.yml"
ENTRYPOINT ["java", "-jar", "/app.jar"]