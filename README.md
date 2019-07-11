## Example scripts invocation:

Last argument is "stage" (requred), either test or prod:
```
npm run deploy test
npm run deploy prod

npm run info test
npm run info prod
```

The automated tests are always executing on test stage and never on prod, if tests pass on "test" -- it will work on "prod" for sure:
```
npm run test
```

To run migrations:
```
npm run migrate test
npm run migrate prod
```

To undo one migration:
```
npm run migrate-undo test
npm run migrate-undo prod
```

## Configuration files
There are 3 independent areas which require DB configuration:
* Runtime services
* Migrations
* Tests (TBD later)

Unfortunately each one of these does it slightly differently. The bruit force approach would be to duplicate the DB config for every area. We actually figured out how to keep the DB config in one file and propagate it where needed.

Take a look at ```.env.sample.yml```. This file is the example which is versioned controlled. You need to clone this file into ```.env.prod.js``` and ```.env.test.js``` -- these files are gitignored -- we do not want to expose life DB connection config to the world, so it's important not to loose them.

The ```serverless.yml``` file will read the stage specific file in the provider section, depending on which "stage" you are deploying to:
```
provider:
  environment:
    DATABASE_URL: ${file(.env.${opt:stage}.js):config.DATABASE_URL}
    HOST: ${file(.env.${opt:stage}.js):config.HOST}
```
As the result, the environment variables ```DATABASE_URL``` and ```HOST``` will be made available for every service running as AWS Lambda Function on that stage. In order for a function to establish a sequelize connection, import the ```./config/consts.js``` like this:
```
import {sequelize} from '../../../../consts'
```
Here's how the ```./consts.js``` referring the environment variable.
```
export var sequelize = new Sequelize(process.env.DATABASE_URL)
```
And, in order to run sequelize migrations, we are expected to create ```./config/config.js``` file. Take a look at it's contents. At the very beginning of the file read the stage specific .env file depending on which stage we run the migration for, like this:
```
const config = require('../.env.'+ env).config();

```
As the result, we can reference these config parameters like the following (in the same file down below):
```
module.exports = {
  test: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    host: config.DB_HOST,
    dialect: config.DB_DIALECT
  },
  prod: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    host: config.DB_HOST,
    dialect: config.DB_DIALECT
  }
};
```
