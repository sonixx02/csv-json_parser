folder structure

backend -> src/ 
config/ db.js
utils/ apiError.js apiResponse.js parseCsv.js  
controllers/ userController.js
routes/ userRoutes.jsapp.jsserver.js
data/ users.csv
.env
package.json
Readme.md  , assumptions.md

Tech Stack & Tools Used
Node.js → runtime environment for executing JavaScript on the server.
Express.js → lightweight framework used to build RESTful APIs and handle routes like /api/users/upload-csv and /api/users.
PostgreSQL → relational database used to store and query user data efficiently.
pg (node-postgres) → PostgreSQL client for Node.js to connect and perform database operations.

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
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,contact.email,contact.phone
Arjun,Rao,27,22 Bluebell Lane,Sunset Boulevard,Bangalore,Karnataka,male,arjun.rao@example.com,9876543210 

// upload-csv endpoint n age distribution output
<img width="1920" height="1080" alt="Screenshot (299)" src="https://github.com/user-attachments/assets/815b8d7e-fdeb-4945-afac-4798919ca1f1" />

// get endpoint results
<img width="1920" height="1080" alt="Screenshot (297)" src="https://github.com/user-attachments/assets/cb02808c-67b0-4ae9-b22f-b5d737406b3b" />

// postgres db 
<img width="1920" height="1080" alt="Screenshot (295)" src="https://github.com/user-attachments/assets/5c196c83-4999-4557-8039-35de37726168" />

