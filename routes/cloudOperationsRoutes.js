const express           = require("express");
const cloudOperate      = require("../controllers/cloudControllers");

const router = express.Router();

//PASSWORD
router.post("/changeMyPassword", cloudOperate.change_password);
//FILES
router.post("/upload/:url(*)", cloudOperate.upload_file);
router.post("/renameFile/:name/:url(*)", cloudOperate.rename_file);
router.get("/download/:file/:url(*)", cloudOperate.download_file);
router.get("/view/:file/:url(*)", cloudOperate.view_file);
router.get("/delete/file/:url(*)", cloudOperate.delete_file);
//FOLDERS
router.post("/create/:url(*)", cloudOperate.create_folder);
router.post("/renameFolder/:name/:url(*)", cloudOperate.rename_folder);
router.get("/delete/folder/:url(*)", cloudOperate.delete_folder);
router.get("/delete/videofolder/:url(*)", cloudOperate.delete_videoFolder);

module.exports = router;