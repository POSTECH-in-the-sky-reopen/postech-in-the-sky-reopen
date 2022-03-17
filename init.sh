docker-compose down -v
docker-compose up --build -d 
docker container logs postech-in-the-sky-reopen_app_1 -f > log 2>&1 &
