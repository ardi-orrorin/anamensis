clear

echo proejct build start....
echo

build_type=$1
version=$2
docker_id=$3
server_file_name=''$build_type'-anamensis-'${version}''

echo 'build_type: '${build_type}''
echo 'version: '${version}''
echo 'docker_id: '${docker_id}''

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

if [[ "$docker_id" == "" ]]
then
    echo 'docker_id is required'
    exit 1
fi

echo 'start '$build_type'-anamensis project build start....'

if [[ "$build_type" == "batch" ]] || [[ "$build_type" == "config" ]] || [[ "$build_type" != "server" ]]
then
  gradle build ':'$build_type':build' -Pversion=${version}
fi


echo 'start '$build_type'-anamensis project build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build --platform linux/amd64 --build-arg='JAR='${server_file_name} -t ${docker_id}/${build_type}-anamensis:latest -f ${build_type}.Dockerfile  .

#docker push ${docker_id}/${build_type}-anamensis:latest

echo 'docker latest build success....'

echo

echo ''$build_type'-docker-compose build start....'

#TAG=${version} PORT=${port} DOCKER_ID=${docker_id} docker-compose -f config-docker-compose.yml build
docker build --platform linux/amd64 --build-arg='JAR='${server_file_name} -t ${docker_id}/${build_type}-anamensis:${version} -f ${build_type}.Dockerfile  .

#docker push ${docker_id}/${build_type}-anamensis:${version}

echo ''$build_type'-docker-compose build success....'

echo 'docker build success....'

echo

echo 'build success....'