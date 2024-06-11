clear

echo proejct build start....
echo

service=$1
version=$2
docker_id=$3
server_file_name=''$service'-anamensis-'$version''

echo 'service: '$service''
echo 'version: '$version''
echo 'docker_id: '$docker_id''

if [[ "$service" != "batch" ]] && [[ "$service" != "config" ]] && [[ "$service" != "server" ]] && [[ "$service" != "nextjs" ]]
then
    echo 'build_type is required'
    exit 1
fi

if [[ "$version" == "" ]]
then
    echo 'version is required'
    exit 1
fi

if [[ "$docker_id" == "" ]]
then
    echo 'docker_id is required'
    exit 1
fi

echo 'start '$service'-anamensis project build start....'

if [[ "$service" == "batch" ]] || [[ "$service" == "config" ]] || [[ "$service" == "server" ]]
then
    gradle build ':'$service':build' -Pversion=$version
fi


echo 'start '$service'-anamensis project build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build --platform linux/amd64 --build-arg='JAR='$server_file_name -t $docker_id/$service-anamensis:latest  -f $service.Dockerfile  .

docker push ${docker_id}/${service}-anamensis:latest

echo 'docker latest build success....'

echo

echo ''$service'-docker-compose build start....'

docker build --platform linux/amd64 --build-arg='JAR='$server_file_name -t $docker_id/$service-anamensis:$version -f $service.Dockerfile  .

docker push ${docker_id}/${service}-anamensis:${version}

echo ''$service'-docker-compose build success....'

echo 'docker build success....'

echo

echo 'build success....'