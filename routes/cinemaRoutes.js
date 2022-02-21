const express           = require("express");
const cinema            = require("../controllers/cinemaControllers");

const router = express.Router();

router.get("/CLOUD/:url(*)", cinema.open_cinema);
router.get("/deleteMovie/:dbName/:movieName/:url(*)", cinema.delete_movie);
router.get("/playMovie/:movieName/:url(*)", cinema.play_movie);
router.get("/video/:path(*)", cinema.player_stream);
router.post("/uploadMovie/:url(*)", cinema.upload_movie);
router.post("/renameMovie/:dbName/:url(*)", cinema.rename_movie);

module.exports = router;