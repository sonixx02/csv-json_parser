##  Task Understanding
1. Build a Node.js API (Express.js) to read a CSV file and store it in PostgreSQL.
2. Each CSV row represents one user, and columns correspond to properties.
3. Nested properties in CSV are represented using dot notation (e.g., `address.city`, `contact.email`).
4. Certain columns are mandatory at the beginning of CSV:
   `name.firstName`, `name.lastName`, `age`.
5. Data should be stored in PostgreSQL table `users` with the following mapping:

    `name` → concatenation of `firstName` + `lastName`
    `age` → integer column
    `address` → JSONB column containing nested address fields
    `additional_info` → JSONB column containing all other fields (gender, contact, etc.)
6. After inserting, the API should calculate Age-Group % Distribution and print to console.


## Assumptions Made

1. CSV File Location:
   The CSV file is read from a path defined in `.env` (`CSV_FILE_PATH`). We do not require file upload via API .

2. Age Validation:

    Age is mandatory. Any missing or invalid age (non-numeric, negative, or >100) will skip the row and log a warning.

3. Batch Insertion:

    Rows are inserted in batches for performance (`BATCH_SIZE` configurable in `.env`).

4. JSON Handling:

    Nested dot-notation fields in CSV (like `address.line1`) are parsed into nested JSON objects.
    All other unknown fields are grouped into `additional_info` JSON column.

5. Duplicate Records:

    Inserting the same CSV multiple times will create duplicate entries.

6. CSV Format Assumptions:

    First line is headers.
    Sub-properties of a complex property are placed next to each other in the CSV.
    Infinite depth is supported (e.g., `a.b.c.d.e`).

7. Error Handling / Response:

    Rows with invalid age are skipped, others are inserted normally.
    Errors during DB insertion or CSV parsing return a JSON error response



