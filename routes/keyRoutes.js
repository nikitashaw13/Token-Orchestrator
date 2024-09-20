const express = require("express");
const router = express.Router();
const keyController = require("../controller/keyController");

router.post("/", keyController.generateToken);
router.get("/", keyController.retrieveKey);
router.get("/:id", keyController.fetchInfo);
router.delete("/:id", keyController.deleteKey);
router.put("/:id", keyController.unblockKey);
router.put("/keepalive/:id", keyController.keepAlive);

module.exports = router;
