const express           = require("express");
const permission        = require("../controllers/permissionControllers");

const router = express.Router();

router.get("/", permission.render_ask);
router.post("/", permission.send_permission_mail);
router.post("/givePermission", permission.give_permission);

module.exports = router;