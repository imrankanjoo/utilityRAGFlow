cd docker
docker compose down
cd ../
docker build -t infiniflow/ragflow:dev .
cd docker
chmod +x ./entrypoint.sh
docker compose up -d
docker logs -f ragflow-server
