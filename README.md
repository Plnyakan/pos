# POS Application

## Overview
This application consists of multiple microservices, including user-service, product-service, upsell-service, and transaction-service, all orchestrated using Docker Compose. The application also utilizes RabbitMQ for messaging and Consul for service discovery.

## Technologies Used
- **Node.js**: 20+ runtime environment
- **Typescript**
- **Fastify**
- **Sequelize** 
- **MySQL** 
- **ESLint**: for code linting
- **Jest**: for unit testing

## Prerequisites
- Docker
- Docker Compose

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Plnyakan/pos.git
cd pos
```

## Build and Run the Services
Use Docker Compose to build and run the services. This command will pull the necessary Docker images, build your services, and start the containers.

```bash
docker-compose up --build
```
## Access the Services
-**User Service: http://localhost:3001**
-**Product Service: http://localhost:3002**
-**Upsell Service: http://localhost:3003**
-**Transaction Service: http://localhost:3004**
-**RabbitMQ Management Console: http://localhost:15672 (default credentials: guest/guest)**
-**Consul UI: http://localhost:8500**

## Project Structure
```bash
├── user-service
│   ├── src
│   ├── Dockerfile
│   ├── __tests__ 
│   └── ...
├── product-service
│   ├── src
│   ├── Dockerfile
│   ├── __tests__ 
│   └── ...
├── upsell-service
│   ├── src
│   ├── Dockerfile
│   ├── __tests__ 
│   └── ...
├── transaction-service
│   ├── src
│   ├── Dockerfile
│   ├── __tests__ 
│   └── ...
├── docker-compose.yml
├── .gitignore
├── .env.example
├── MunchPos.postman_collection.json
├── .eslintrc.json (ESLint configuration)
├── jest.config.js (Jest configuration)
└── README.md
```

## Services Overview

**User Service**
Handles user-related operations, such as registration and authentication.

**Product Service**
Manages product-related operations, such as creating and retrieving products.

**Upsell Service**
Manages the upselling of products.

**Transaction Service**
Handles transaction-related operations.


## Common Issues

1. **RabbitMQ Connection Issues**
If any service fails to connect to RabbitMQ, ensure RabbitMQ is running and the RABBITMQ_HOST environment variable is set correctly.

2.**Database Connection Issues**
Ensure the database service is running and the connection details in the environment variables are correct.

3. **Consul Connection Issues**
Ensure Consul is running and the CONSUL_HOST environment variable is set correctly.


## Additional Commands

**Rebuild Services**
If you make changes to the code, you can rebuild the services using:
```bash
docker-compose up --build
```

**Stopping Services**
To stop the services, use:
```bash
docker-compose down
```

**Removing Volumes**
To remove the volumes (including database data), use:
```bash
docker-compose down -v
```