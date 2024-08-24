clear

echo proejct build start....
echo

service=$1
version=$2
docker_id=$3
base_id=$4
platform=linux/amd64,linux/arm64

if [ "$service" == "base" ] && [ "$version" != "" ] && [ "$docker_id" != "" ]
then
    docker buildx build --platform $platform --push -t $docker_id/anamensis-base:latest -f base.Dockerfile  .
    docker buildx build --platform $platform --push -t $docker_id/anamensis-base:$version -f base.Dockerfile  .
    exit 1
fi

if [ "$service" != "batch" ] && [ "$service" != "config" ] && [ "$service" != "site" ]
then
    echo 'service is required'
    exit 1
fi

if [ "$version" == "" ]
then
    echo 'version is required'
    exit 1
fi

if [ "$docker_id" == "" ]
then
    echo 'docker_id is required'
    exit 1
fi

if [ "$base_id" == "" ]
then
    echo 'base_id is required'
    exit 1
fi

echo 'start '$service'-anamensis project build start....'

if [ "$service" == "batch" ] || [ "$service" == "config" ]
then
    gradle build ':'$service':build' -Pversion=$version
elif [ "$service" == "site" ]; then
    gradle build ':server:build' -Pversion=$version
fi

echo 'start '$service'-anamensis project build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

if [ "$service" == "site" ]
then
    sed -i "s|__DOCKER_ID__|$base_id|g" site.Dockerfile

    sed -i "s|__VERSION__|$version|g" ./client/package.json
    sed -i "s|__VERSION__|$version|g" ./client/package-lock.json

    server_file_name='server-anamensis-'$version''


else
    server_file_name=''$service'-anamensis-'$version''
fi

docker buildx build --platform $platform --push --build-arg='JAR='$server_file_name -t $docker_id/$service-anamensis:latest  -f $service.Dockerfile  .

echo 'docker latest build success....'

echo

echo ''$service'-docker-compose build start....'

docker buildx build --platform $platform --push --build-arg='JAR='$server_file_name -t $docker_id/$service-anamensis:$version -f $service.Dockerfile  .


if [ "$service" == "site" ]
then
    rm -rf site.Dockerfile
fi

echo ''$service'-docker-compose build success....'

echo 'docker build success....'

echo

echo 'build success....'