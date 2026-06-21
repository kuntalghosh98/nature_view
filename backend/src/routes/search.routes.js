const express = require("express");
const { searchContent } = require("../controllers/search.controller");

const router = express.Router();

router.get("/", searchContent);

module.exports = router;