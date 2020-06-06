# temperature-map-app

## Features

- Upload data file
- load data on map

## Requirements

- mapbox API key
- install and run [docker](https://docs.docker.com/) for deployment

## Setup

### Backend

- go to backend directory

```
cd packages/backend
```

- run eslint

```
npm run eslint
```

- start and watch application in nodemon

```
npm run dev
```

- build and run application

```
npm run build && npm start
```

### Frontend

- go to frontend folder

```
cd packages/frontend
```

- create `.env` file inside frontend folder and add mapbox api key

```
REACT_APP_mapboxToken=
```

- run eslint

```
npm run eslint
```

- run application

```
npm start
```

You can skip above running instruction, if you wish to run applications in docker. See instruction in deployment section.

## Deployment

- go back to root directory of project
- use docker-compose to run both frontend and backend application in container

```
docker-compose build
```

\*\* needed when rebuilding images

```
docker-compose up
```

- use sample data file `C-data.json` (data with temperature in Celcius) & `F-data.json` (data with temperature in Fahrenheit) inside `resources` folder or create your own json file
