echo .

version=$1

echo 'start springboot build'
gradle build ':server:build' -Pversion=${version}

echo 'docker build '+${version}
docker build --build-arg='JAR=server-anamensis-'${version} -t springboot-docker:${version}  .

echo 'docker build latest'
docker build --build-arg='JAR=server-anamensis-'${version} -t springboot-docker:latest  .

docker run -it -p 18080:8080 springboot-docker:${version}
