# Docker

## Info & Stats

```bash
# Show installed docker version
docker version

# Show the logs of a container
docker logs <container> <image>

# Show stats of running container’s
docker stats

# Show processes of container
docker top <container>
```

## Images

```bash
# Build an image from a Dockerfile
docker build -t <image> .

# Build an image from a Dockerfile without the cache
docker build -t <image> . --no-cache

# List local images
docker images

# Delete an image
docker rmi <image>

# Remove all unused images
docker image prune
```

## Containers

```bash
# Create and run a container from an image with a custom name
docker run --name <container> <image>

# Run a container with and publish a container’s port(s) to the host.
docker run -p <host_port>:<container_port> <image>

# Run a container in the background
docker run -d <image_name>

# Start or stop an existing container
docker start|stop <container_name> (or <container-id>) 
```
