clear

echo proejct build start....
echo

service=$1
version=$2
port=$3
docker_id=$4


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

if [[ "$port" == "" ]]
then
    echo 'port is required'
    exit 1
fi

if [[ "$docker_id" == "" ]]
then
    echo 'docker_id is required'
    exit 1
fi

echo 'service: '$service
echo 'version: '$version''
echo 'port: '$port''
echo 'docker_id: '$docker_id''

echo 'docker image pull success....'

TAG=$version PORT=$port DOCKER_ID=$docker_id docker-compose -f docker-compose.yml pull $docker_id/config
TAG=$version PORT=$port DOCKER_ID=$docker_id docker-compose -f docker-compose.yml pull $docker_id/nextjs
TAG=$version PORT=$port DOCKER_ID=$docker_id docker-compose -f docker-compose.yml pull $docker_id/server

echo 'docker image pull success....'

echo 'docker stack deploy start....'

TAG=$version PORT=$port DOCKER_ID=$docker_id docker stack deploy -d -c docker-compose.yml anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'