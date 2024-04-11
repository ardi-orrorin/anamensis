echo .

version=$1
file_name='server-anamensis-'${version}''

if((!version))
then
    echo 'version is required'
    exit 1
fi

echo 'start anamensis build'
gradle build ':server:build' -Pversion=${version}

echo 'docker build '+${version}
docker build --build-arg='JAR='${file_name} -t anamensis:${version}  .

echo 'docker build latest'
docker build --build-arg='JAR='${file_name} -t anamensis:latest  .

#docker push username/anamensis:${version}
#docker push username/anamensis:latest

TAG=${version} docker stack deploy -c docker-compose.yml anamensis