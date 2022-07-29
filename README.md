## Palpittero Backend - NodeJS Rest API

### Requirements
- NodeJS v14+ ([download](https://nodejs.org/en/download/))
- SQLite 3 ([intallation](https://github.com/TryGhost/node-sqlite3))

**After installing NodeJS, SQLite 3 can be globally installed using NPM** _(this is required for creating the initial test database)_

```
npm install -g sqlite3
``` 

### Installation

1. Clone the repo to a directory
```
git clone https://github.com/palpittero/palpitter-be
```

2. Enter the `backend` directory and run the installation command
```
cd backend && npm install
```

3. Execute the command to create the database file
```
npm run db:create
```

4. Execute the command to create the database structure
```
npm run db:migrate
```

5. Execute the command to feed the database with initial mocked data
```
npm run db:seed
```

6. Run the application
```
npm run dev
```

### Other database commands

1. Drop current file
```
npm run db:drop
```

_It will throw an error if the database file does not exist_

2. Reset database (remove file, create new file, create structure and seed)
```
npm run db:reset
```

_It will throw an error if the database file does not exist_

**By default, the application will run on `http://localhost:3000`**

### Postman Collection

- [Download Postman JSON](https://www.postman.com/collections/fab8e7a24ef7b68da0a2) created with some of the available endpoints (it will still be updated)

Import the link directly on Postman to have access to the collection.
Once the authentication is made using the `POST /auth` endpoint, the tokens will be automatically set as headers to all of the other endpoints.
