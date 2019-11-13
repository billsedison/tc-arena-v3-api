# Topcoder SRM Problem REST API

## Dependencies

- nodejs https://nodejs.org/en/ (v10)
- PostgreSQL
- Docker, Docker Compose
- git
- Heroku CLI
- Heroku account

## Configuration

Configuration for the application is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level, default is 'debug'
- PORT: the server port, default is 3000
- API_VERSION: the api version, default is '/v5'
- AUTH_SECRET: The authorization secret used during token verification.
- VALID_ISSUERS: The valid issuer of tokens, a json array contains valid issuer.
- POSTGRES_SSL: The flag indicate whether using SSL when connect to PostgreSQL
- POSTGRES_URL: The PostgreSQL database url
- DB_SCHEMA_NAME: The database schema name

Configuration for production environment is at `config/production.js`. It will also be used by Heroku. We need to use SSL when connecting to heroku-postgresql. We can get the heroku-postgresql instance URL from environment variable `DATABASE_URL`.

Configuration for testing is at `config/test.js`. It have `POSTGRES_URL` and `DB_SCHEMA_NAME` so you can use different database and different schema for testing.

Generally you just need to modify `POSTGRES_URL` in `config/default.js` and `config/test.js` for your review.

## Postgres Database Setup

1. Go to https://www.postgresql.org/ download and install the Postgres.
Modify `POSTGRES_URL` under `config/default.js` and `config/test.js` to meet your environment.
2. Run `npm run init-db` to create table.
3. Run `npm run test-data` to insert test data into database.

## Local Deployment

- Install dependencies `npm install`
- Run lint `npm run lint`
- Run lint fix `npm run lint:fix`
- Initialize db `npm run init-db`
- Insert test data into db `npm run test-data`
- Start app `npm start`
- App is running at `http://localhost:3000`

## Docker Deployment

- Go to `docker` folder
- Rename the file `sample.api.env` to `api.env` And properly update the IP addresses to match your environment for the variable POSTGRES_URL( make sure to use IP address instead of hostname ( i.e localhost will not work)).Here is an example:
```
POSTGRES_URL=postgres://postgres:password@192.168.31.8:5432/postgres
```
- Once that is done, run the command `docker-compose up`
- When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## Heroku deployment

- git init
- git add .
- git commit -m 'message'
- heroku login
- heroku create [application-name] // choose a name, or leave it empty to use generated one
- heroku addons:create heroku-postgresql:hobby-dev // create Heroku Postgres add-on
- git push heroku master // push code to Heroku
- to initialize db, run `heroku run npm run init-db`
- to insert test data, run `heroku run npm run test-data`

## Verification

### Test
##### You need to `stop` the app before running unit or e2e tests.
- Run `npm run test` to execute unit tests and generate coverage report.
- RUN `npm run e2e` to execute e2e tests and generate coverage report.

### Postman
1. import Postman collection and environment in the docs folder to Postman
2. run `npm run init-db` and `npm run test-data` before testing.
