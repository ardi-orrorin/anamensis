clear

echo proejct build start....
echo

build_type=$1
version=$2
port=$3
docker_id=$4


if [[ "$build_type" != "batch" ]] && [[ "$build_type" != "config" ]] && [[ "$build_type" != "server" ]] && [[ "$build_type" != "nextjs" ]]
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

echo 'build_type: '$build_type''
echo 'version: '$version''
echo 'port: '$port''
echo 'docker_id: '$docker_id''

echo 'docker image pull start....'

TAG=$version PORT=$port DOCKER_ID=$docker_id docker-compose -f docker-compose.yml pull $build_type-anamensis

echo 'docker image pull success....'


echo 'docker stack deploy start....'

TAG=$version PORT=$port DOCKER_ID=$docker_id docker stack deploy -c docker-compose.yml $build_type-anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'