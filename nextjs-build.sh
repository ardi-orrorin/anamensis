clear

echo proejct build start....
echo

version=$1
port=$2
batch_file_name='nextjs-anamensis-'${version}''

if((!version))
then
    echo 'version is required'
    exit 1
fi

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build -t nextjs-anamensis:latest -f nextjs.Dockerfile  .

echo 'docker latest build success....'

echo


echo 'nextjs-docker-compose build start....'

TAG=${version} docker-compose -f nextjs-docker-compose.yml build

echo 'nextjs-docker-compose build success....'

echo 'docker build success....'

echo

echo 'docker stack deploy start....'

TAG=${version} PORT=${port} docker stack deploy -c nextjs-docker-compose.yml nextjs-anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'