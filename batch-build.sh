clear

echo proejct build start....
echo

version=$1
port=$2
config=$3
batch_file_name='batch-anamensis-'${version}''


if((!version))
then
    echo 'version is required'
    exit 1
fi

if((!port))
then
    echo 'port is required'
    exit 1
fi

if((!config))
then
    echo 'config is required'
    exit 1
fi

echo 'start batch-anamensis proejct build start....'

gradle build ':batch:build' -Pversion=${version}

echo 'start batch-anamensis proejct build success....'

echo

echo 'docker build start....'

echo

echo 'docker latest build start....'

docker build --build-arg='JAR='${batch_file_name} -t batch-anamensis:latest -f Batch-Dockerfile .

echo 'docker latest build success....'

echo


echo 'batch-docker-compose build start....'

TAG=${version} CONFIG_FILE=${config} docker-compose -f batch-docker-compose.yml build

echo 'batch-docker-compose build success....'

echo 'docker build success....'

echo

echo 'docker stack deploy start....'

TAG=${version} PORT=${port} CONFIG_FILE=${config} docker stack deploy -c batch-docker-compose.yml batch-anamensis

echo 'docker stack deploy success....'

echo

echo 'build success....'