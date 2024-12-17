const express = require("express");
const router = express.Router();

const modelsController = require("../controllers/modelsController");
const passwordProtect = require("../middlewares/passwordProtect");

// Define routes for car models
router.get("/", modelsController.getAllModels);
router.get("/:id/cars", modelsController.getCarsByModel);
router.get("/new", modelsController.newModelForm);
router.get("/:id/edit", modelsController.editModel);

router.post("/", modelsController.addModel);
router.put("/:id", passwordProtect, modelsController.updateModel);
router.delete("/:id", passwordProtect, modelsController.deleteModel);

module.exports = router;
