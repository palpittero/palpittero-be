## Palpittero Backend - NodeJS Rest API

### Requirements
- NodeJS v14+ ([download](https://nodejs.org/en/download/))
- Docker ([download](https://www.docker.com/products/docker-desktop/))

**I'm suggesting installing Docker Desktop because of its intuitive interface**

### Installation

1. Clone the repo to a directory
```
git clone https://github.com/palpittero/palpittero-be
```

2. Enter the `palpittero-be` directory and install the dependencies
```
npm install
```

3. Execute the command to start the database container
```
docker-compose up -d
```

4. Execute the command to create the database structure
```
npm run db:migrate
```

5. Execute the command to feed the database with initial mocked data
```
npm run db:seed
```

6. Create a file named `.env.development` on the root directory of the project and feed it the env variables (available on the online project documentation)

7. Run the application
```
npm run dev
```

**By default, the API will run on `http://localhost:3000/api`**

### Postman Collection

- [Download Postman JSON](https://www.postman.com/collections/fab8e7a24ef7b68da0a2) created with some of the available endpoints (it will still be updated)

Import the link directly on Postman to have access to the collection.
Once the authentication is made using the `POST /auth` endpoint, the tokens will be automatically set as headers to all of the other endpoints.
