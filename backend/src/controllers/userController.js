const pool = require("../config/db");
const parseCsv = require("../utils/parseCsv");
const apiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// Helper function -> convert . keys -> nested objects
function expandDots(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }
  return result;
}

const insertBatch = async (batch) => {
  if (!batch || batch.length === 0) return;

  // multi-row -> for parameterized values
  const values = [];
  const placeholders = batch.map((row, i) => {
    const base = i * 4;
    values.push(row.name, row.age, row.address, row.additional_info);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
  });

  const text = `INSERT INTO users ("name", age, address, additional_info) VALUES ${placeholders.join(", ")}`;
  await pool.query(text, values);
};

const processCsv = async (req, res) => {
  const filePath = process.env.CSV_FILE_PATH;
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE, 10) || 100;
  const inserted = { count: 0 };
  let skippedCount = 0;

  if (!filePath) {
    return res.status(400).json(apiResponse.error("CSV_FILE_PATH not configured", 400));
  }

  const batch = [];

  try {
    for await (const row of parseCsv(filePath)) {
      //  dot notation -> nested JSON
      const expandedRow = expandDots(row);

      const firstName = expandedRow.name?.firstName || "";
      const lastName = expandedRow.name?.lastName || "";

      // age check
      const ageRaw = expandedRow.age;
      const ageNum = Number(ageRaw);

      if (!ageRaw || isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
        console.warn(` Skipping invalid age for user: ${firstName} ${lastName} -> "${ageRaw}"`);
        skippedCount++;
        continue;
      }

      const address = expandedRow.address || null;

      // for additional_info, remove known fields
      const additional_info = JSON.parse(JSON.stringify(expandedRow));
      delete additional_info.name;
      delete additional_info.age;
      delete additional_info.address;

      batch.push({
        name: `${firstName} ${lastName}`.trim(),
        age: ageNum,
        address,
        additional_info,
      });

      if (batch.length >= BATCH_SIZE) {
        await insertBatch(batch);
        inserted.count += batch.length;
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await insertBatch(batch);
      inserted.count += batch.length;
    }

    //  age distribution logic
    const { rows } = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE age < 20) AS lt20,
        COUNT(*) FILTER (WHERE age BETWEEN 20 AND 40) AS between20_40,
        COUNT(*) FILTER (WHERE age BETWEEN 41 AND 60) AS between41_60,
        COUNT(*) FILTER (WHERE age > 60) AS gt60,
        COUNT(*) AS total
      FROM users`
    );

    const stats = rows[0] || { lt20: 0, between20_40: 0, between41_60: 0, gt60: 0, total: 0 };

    const distribution = {
      "<20": stats.lt20 && stats.total ? (stats.lt20 / stats.total) * 100 : 0,
      "20 to 40": stats.between20_40 && stats.total ? (stats.between20_40 / stats.total) * 100 : 0,
      "40 to 60": stats.between41_60 && stats.total ? (stats.between41_60 / stats.total) * 100 : 0,
      "> 60": stats.gt60 && stats.total ? (stats.gt60 / stats.total) * 100 : 0,
    };

    console.log("Age-Group % Distribution");
    Object.entries(distribution).forEach(([k, v]) => console.log(`${k} ${v.toFixed(2)}`));

    return res.json(
      apiResponse.success({
        inserted: inserted.count,
        skipped: skippedCount,
        distribution,
      })
    );
  } catch (err) {
    console.error(err);
    const status = err instanceof ApiError ? err.status || 500 : 500;
    return res
      .status(status)
      .json(apiResponse.error(err.message || "Server error", status, err.details || null));
  }
};

// src/controllers/userController.js
const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
    return res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { processCsv, getUsers };


