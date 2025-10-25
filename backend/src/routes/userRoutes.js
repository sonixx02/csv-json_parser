const express = require("express");
const router = express.Router();
const { processCsv , getUsers } = require("../controllers/userController");

router.post("/upload-csv", processCsv);
router.get("/all", getUsers);


module.exports = router;
