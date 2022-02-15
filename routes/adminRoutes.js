const express           = require("express");
const admin             = require("../controllers/adminControllers");
const signInController  = require("../controllers/signIn");

const router = express.Router();

router.get("/", admin.open_admin);
router.get("/signIn", signInController.open_signIn);
router.post("/signIn",signInController.sign_in);
router.post("/firstSignIn",signInController.first_sign_in);
router.post("/delete/:id", admin.delete_user);
router.post("/warn/:id", admin.warn_user);

module.exports = router;