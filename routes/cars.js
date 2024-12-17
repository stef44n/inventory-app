const express = require("express");
const router = express.Router();

const carsController = require("../controllers/carsController");
const passwordProtect = require("../middlewares/passwordProtect");

// Define routes for cars
router.get("/", carsController.getAllCars);
router.get("/new", carsController.newCarForm);
router.get("/:id", carsController.getCarById);
router.get("/:id/edit", carsController.editCar);

router.post("/", carsController.addCar);
router.put("/:id", passwordProtect, carsController.updateCar);
router.delete("/:id", passwordProtect, carsController.deleteCar);

module.exports = router;
