const express           = require("express");
const cinema            = require("../controllers/cinemaControllers");

const router = express.Router();

router.get("/CLOUD/:url(*)", cinema.open_cinema);
router.get("/deleteMovie/:dbName/:movieName/:url(*)", cinema.delete_movie);
router.get("/videoOpen/:path(*)", cinema.open_videoPlayer);
router.get("/video/:path(*)", cinema.play_video);
router.post("/uploadMovie/:url(*)", cinema.upload_movie);
router.post("/renameMovie/:dbName/:url(*)", cinema.rename_movie);

module.exports = router;