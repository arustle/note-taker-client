# Functionality of the application

This application will allow creating/removing/updating/fetching items. Each item can have a multiple attachments. Each user only has access to items that they have created.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/auth/auth.config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

A Postman collection is provided in the backend project. This can be imported into Postman.
