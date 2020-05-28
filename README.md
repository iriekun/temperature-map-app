# temp-map-app

## Features

- User opens the application which shows a blank map.
- User uploads a data file and a map is shown with locations' temperatures according to the data.
- User is able to switch from °C to °F (or °F to °C) and the temperatures are shown in the chosen unit.
- The uploaded file has temperature unit based on selected switch
- File validation to allow only json file
- Cities and temperature in selected unit (°C or °F) are shown on map if the file is uploaded successfully
- User can switch from °C to °F or °F to °C after the map rendered to see the conversion of temperature in either °C or °F

## Requirements

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

- use sample data file `C-data.json` (data with temperature in Celcius) & `F-data.json` (data with temperature in Fahrenheit) or create your own json file
