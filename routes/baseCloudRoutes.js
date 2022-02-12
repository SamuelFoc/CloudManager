const express           = require("express");
const cloudBase      = require("../controllers/cloudBase");

const router = express.Router();

router.get("/", cloudBase.open_CLOUD);
router.get("/:folder(*)", cloudBase.open_folder);

module.exports = router;