clear

echo proejct build start....
echo

version=$1
port=$2
server_file_name='server-anamensis-'${version}''


if((!version))
then
    echo 'version is required'
    exit 1
fi

echo 'start server-anamensis proejct build start....'

gradle build ':server:build' -Pversion=${version}

echo 'start server-anamensis proejct build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build --build-arg='JAR='${server_file_name} -t server-anamensis:latest  .

echo 'docker latest build success....'

echo


echo 'server-docker-compose build start....'

TAG=${version} docker-compose -f server-docker-compose.yml build

echo 'server-docker-compose build success....'

echo 'docker build success....'

echo

echo 'docker stack deploy start....'

TAG=${version} PORT=${port} docker stack deploy -c server-docker-compose.yml server-anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'