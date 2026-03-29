# Docker Compose

## Commands

```bash
docker compose version
docker compose config

docker compose start
docker compose stop
docker compose restart
docker compose run  

docker compose create compose
docker compose attach      
docker compose pause
docker compose unpause

docker compose wait   
docker compose up
docker compose down

docker compose ps
docker compose top 
docker compose events   
docker compose logs

docker compose images
docker compose build      
docker compose push  
docker compose cp       
docker compose exec 
```


## Basic example

```yaml title="docker-compose.yml"
services:
  web:
    build:
    # build from Dockerfile
      context: ./Path
      dockerfile: Dockerfile
    ports:
     - "5000:5000"
    volumes:
     - .:/code
  redis:
    image: redis
```