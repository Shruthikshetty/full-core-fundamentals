# Express Fundamentals

## Steps to run the project:

1. `npm install`
2. `npm run dev`
3. Go to `localhost:3000`

## install rest client extension to check the api calls

## To add a .env file:

1. Create a new file in the root of your project and name it `.env`.
2. Add your environment variables in the format `KEY=VALUE`. For example:
   ```
   PORT=3000
   ```
3. keys req PORT , MONGO_URL

## Setting Up Jest in the Project:

4. Intall following pacakges to set up jest

   ```
   npm install --save-dev  @babel/core @babel/preset-env @babel/node jest @types/jest
   ```

5. create a .babelrc
   ```json
   {
     "presets": [
       [
         "@babel/preset-env",
         {
           "targets": {
             "node": "current"
           }
         }
       ]
     ]
   }
   ```

6. Once done, run `jest --init`. This will create a `jest.config.mjs` file. Make sure to comment out the `moduleFileExtensions` line and add the following under the `transform` property:
   ```javascript
   transform: {
       "^.+\\.m?js$": "babel-jest"
   },
   ```

7. Ensure that you create a `jsconfig.json` file and add the following content:
   ```json
   {
       "typeAcquisition": {
           "include": ["jest"]
       }
   }
   ```
   This will ensure that the required global imports for Jest are set up correctly.

8. It is a common practice to place all test files in a `__tests__` folder and to name each test file with the suffix `.test.js` or `.spec.js`.