развертывание проекта

git clone https://github.com/Hydralisk-zerg/sandbox

для бэкэнда

cd sandbox/

python3 -m venv venv

source venv/bin/activate

pip3 install -r requirements.txt

запустить докер десктоп после запустить контейнер   docker-compose up -d

cd backend

python3 manage.py migrate 



python3 manage.py runserver

для фронта

cd sandbox/

cd frontend/

npm install
