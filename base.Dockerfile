FROM       openjdk:21-slim
LABEL      author="ARDI"
RUN        apt-get update
RUN        apt-get install -y curl
RUN        apt-get install -y nodejs
RUN        apt-get install -y npm