 Tech Stack
 ```
· Node.js - Runtime environment
· Express.js - Web framework
· PostgreSQL - Database
· pg (node-postgres) - PostgreSQL client
```

Project Structure

```
backend/
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
├── data/
│   └── users.csv
├── .env
├── package.json
├── README.md
└── assumptions.md
```

Setup Instructions

Prerequisites

· Node.js (v14 or higher)
· PostgreSQL
· npm or yarn

1. Clone the Repository

```bash
git clone <your-repo-url>
cd project
```

2. Install Dependencies

```bash
npm install
```

3. Environment Configuration

Create a .env file in the root directory:

```env
PORT=3000
CSV_FILE_PATH=./data/users.csv
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_pg_username
DB_PASSWORD=your_pg_password
DB_NAME=kelpdb
BATCH_SIZE=100
```

4. Database Setup

Create Database

```sql
CREATE DATABASE kelpdb;
```

Create Users Table

```sql
CREATE TABLE public.users (
  "name" varchar NOT NULL,
  age int4 NOT NULL,
  address jsonb NULL,
  additional_info jsonb NULL,
  id serial4 PRIMARY KEY
);
```

5. Run the Server

```bash
npm run dev
```

Server will run on: http://localhost:3000

API Endpoints

1. Upload CSV File

POST /api/users/upload-csv

Uploads and processes a CSV file containing user data.

Request:

· Method: POST
· Endpoint: /api/users/upload-csv
· Body: Form-data with CSV file

Response:

```json
{
  "success": true,
  "data": {
    "inserted": 1,
    "skipped": 0,
    "distribution": {
      "<20": 12.5,
      "20 to 40": 50,
      "40 to 60": 25,
      "> 60": 12.5
    }
  }
}
```

2. Get All Users

GET /api/users/all

Retrieves all users from the database.

Response:

```json
{
  "success": true,
  "users": [
    {
      "name": "Robit Prasad",
      "age": 35,
      "address": {
        "city": "Pune",
        "line1": "A-563 Rakshak Society",
        "line2": "New Pune Road",
        "state": "Maharashtra"
      },
      "additional_info": {
        "gender": "male",
        "id": 1
      }
    }
  ]
}
```

CSV Format

Create your CSV file in /data/users.csv with the following format:

```csv
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,contact.email,contact.phone
Arjun,Rao,27,22 Bluebell Lane,Sunset Boulevard,Bangalore,Karnataka,male,arjun.rao@example.com,9876543210
Priya,Sharma,32,45 Green Park,Main Road,Mumbai,Maharashtra,female,priya.sharma@example.com,9123456789
```

Usage Examples

Upload CSV via Postman

1. Open Postman
2. Set method to POST
3. URL: http://localhost:3000/api/users/upload-csv
4. Go to Body → form-data
5. Add key: file (type: File)
6. Select your CSV file
7. Send request

Get Users via Postman

1. Open Postman
2. Set method to GET
3. URL: http://localhost:3000/api/users/all
4. Send request

Expected Outputs

CSV Upload Response
// upload-csv endpoint n age distribution output
<img width="1920" height="1080" alt="Screenshot (299)" src="https://github.com/user-attachments/assets/815b8d7e-fdeb-4945-afac-4798919ca1f1" />

// get endpoint results
<img width="1920" height="1080" alt="Screenshot (297)" src="https://github.com/user-attachments/assets/cb02808c-67b0-4ae9-b22f-b5d737406b3b" />

// postgres db 
<img width="1920" height="1080" alt="Screenshot (295)" src="https://github.com/user-attachments/assets/5c196c83-4999-4557-8039-35de37726168" />

Configuration

Batch Processing

The BATCH_SIZE in .env controls how many records are processed at once:

· Default: 100 records per batch
· Adjust based on your server capabilities

CSV File Path

· Default path: ./data/users.csv
· Configurable via CSV_FILE_PATH in .env

Error Handling

The API provides meaningful error messages for:

· Database connection issues
· Invalid CSV formats
· Missing required fields
· File upload errors
· Server errors
