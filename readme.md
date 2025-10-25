folder structure
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   └── parseCsv.js
│   ├── controllers/
│   │   └── userController.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── app.js
│   └── server.js
│
├── data/
│   └── users.csv
├── .env
├── package.json
└── Readme.md  , assumptions.md


## Setup Instructions

Clone the repo

git clone <your-repo-url>
cd project


Install dependencies

npm install


Setup .env
Example .env:

PORT=3000
CSV_FILE_PATH=./data/users.csv
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_pg_username
DB_PASSWORD=your_pg_password
DB_NAME=kelpdb
BATCH_SIZE=100


## Setup PostgreSQL database

CREATE DATABASE kelpdb;

CREATE TABLE public.users (
  "name" varchar NOT NULL,
  age int4 NOT NULL,
  address jsonb NULL,
  additional_info jsonb NULL,
  id serial4 PRIMARY KEY
);

Run the server
npm run dev
Server runs on http://localhost:3000



POST url/api/users/upload-csv
this is the endpoint to run on postman 
takes csv path from .env


// add data in /data folder in this format name should be users.csv
<!-- name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,contact.email,contact.phone
Arjun,Rao,27,22 Bluebell Lane,Sunset Boulevard,Bangalore,Karnataka,male,arjun.rao@example.com,9876543210 -->