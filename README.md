crawler-demo

# System design

![alt text](<https://github.com/fantasy96/crawler/blob/develop/development/design/crawler-system%20(1).png>)

# Database design

![alt text](<https://github.com/fantasy96/crawler/blob/develop/development/design/crawler-system%20(2).png>)

# Add site to crawl

1. Access to site you want to crawl

2. Inspect the site pages and get html/css tag of infomation

3. Edit config file in path /src/crawler-service/config.js

4. Run server

# Set up for local development environment

## Requirement

- docker
- docker-compose

## Set up

- In main project, run

```bash
yarn setup
```

- To add hosts, run (once):

```bash
yarn setup:hosts
```

## Run server

- In main project, to active the server:

```bash
yarn dcc:up
```

## Access web-service

http://localhost:8001/<web-service>

## Run unit-test

```bash
yarn unit-test
```

## Stop server

```bash
yarn dcc:down
```
