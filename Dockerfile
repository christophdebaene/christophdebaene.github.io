FROM python:3.12-slim

# Install git (needed by GitPython / mkdocs-rss-plugin)
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /tmp

COPY requirements.txt .
RUN \
    pip install -r requirements.txt && \
    rm requirements.txt

WORKDIR /docs