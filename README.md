# postech-in-the-sky-reopen
## getting started
### up
```
docker-compose down -v
docker-compose up --build -d 
docker container logs postech-in-the-sky-reopen_app_1 -f > log 2>&1 &
```
### init
```
docker exec -it postech-in-the-sky-reopen_app_1 npm run migrate:run
python3 -m virtualenv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 tools/access.py
```
