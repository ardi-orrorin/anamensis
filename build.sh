clear

ehoc build start....

version=$1
file_name='server-anamensis-'${version}''

if((!version))
then
    echo 'version is required'
    exit 1
fi

echo 'start anamensis build...'

gradle build ':server:build' -Pversion=${version}


echo 'docker build start....'

TAG=${version} docker-compose build
TAG=${version} docker stack deploy -c docker-compose.yml anamensis

echo 'build success....'