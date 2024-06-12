# Polling System API

This is a polling system API where users can create polls, vote on them, and chat with other users within the same poll. The application includes user registration, login, OTP verification, and password reset functionalities.

## Features

- User registration and login with email verification
- OTP-based password reset
- Create, vote, and view polls
- Real-time voting results using Socket.IO
- Chat functionality within polls
- MongoDB for data storage
- Redis for caching and real-time operations
- JWT-based authentication

## Prerequisites

- Node.js (v14 or above)
- MongoDB
- Redis

## Environment Variables

Create a `.env` file in the root directory with the following content:

```env
MONGODB_LOCAL_URL="<your_mongodb_url>"
REDIS_LOCAL_URL="<your_redis_url>"

APPLICATION_GMAIL="<your_application_gmail>"
APPLICATION_GMAIL_PASSWORD="<your_application_gmail_password>"
OTP_EXPIRATION="<otp_expiration_time>"
OTP_RESEND_INTERVAL="<otp_resend_interval>"
JWT_SECRET="<your_jwt_secret>"
```

## Installation
Install dependencies:
```cmd
npm install
#or
yarn install
```

Build the project:
```cmd
npm run build
#or
yarn build
```

Start the project with nodemon
```cmd
npm run start
#or
yarn start
```

## Generate Swagger Documentation
To generate Swagger documentation:
```cmd
npm run swagger-autogen
# or
yarn swagger-autogen
```
After generating the Swagger documentation, you can access it at: http://localhost:5000/api-docs/


## Docker Commands

Create a `docker image` :

Build the Docker image:
```docker
docker build -t polling-system-api .
```

Run the Docker container:
```docker
docker run -p 5000:5000 polling-system-api
```

Stop the Docker container:
```docker
docker stop <container_id>
```

Remove the Docker container:
```docker
docker rm <container_id>
```

View running Docker containers:
```docker
docker ps
```

