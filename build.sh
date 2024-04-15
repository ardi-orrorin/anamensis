clear

echo proejct build start....
echo

version=$1
port=$2
file_name='server-anamensis-'${version}''

if((!version))
then
    echo 'version is required'
    exit 1
fi

echo 'start anamensis proejct build start....'

gradle build ':server:build' -Pversion=${version}

echo 'start anamensis proejct build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build --build-arg='JAR='${file_name} -t anamensis:latest  .

echo 'docker latest build success....'

echo


echo 'docker-compose build start....'

TAG=${version} docker-compose build

echo 'docker-compose build success....'

ehoc 'docker build success....'

echo

echo 'docker stack deploy start....'

TAG=${version} PORT=${port} docker stack deploy -c docker-compose.yml anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'