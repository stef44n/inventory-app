const express = require("express");
const router = express.Router();

const makesController = require("../controllers/makesController");
const passwordProtect = require("../middlewares/passwordProtect");

// Define routes for car makes
router.get("/", makesController.getAllMakes);
router.get("/:id/cars", makesController.getCarsByMake);
router.get("/new", makesController.newMakeForm);
router.get("/:id/edit", makesController.editMake);

router.post("/", makesController.addMake);
router.put("/:id", passwordProtect, makesController.updateMake);
router.delete("/:id", passwordProtect, makesController.deleteMake);

module.exports = router;
