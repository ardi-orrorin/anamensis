echo .

version=$1

echo 'start anamensis build'
gradle build ':server:build' -Pversion=${version}

echo 'docker build '+${version}
docker build --build-arg='JAR=server-anamensis-'${version} -t anamensis:${version}  .

echo 'docker build latest'
docker build --build-arg='JAR=server-anamensis-'${version} -t anamensis:latest  .

docker-compose up -d