const express = require("express");
const router = express.Router();

const vehicleTypesController = require("../controllers/vehicleTypesController");
const passwordProtect = require("../middlewares/passwordProtect");

// Define routes for vehicle types
router.get("/", vehicleTypesController.getAllVehicleTypes);
router.get("/:id/cars", vehicleTypesController.getCarsByVehicleType);
router.get("/new", vehicleTypesController.newVehicleTypeForm);
router.get("/:id/edit", vehicleTypesController.renderEditVehicleTypeForm);

router.post("/", vehicleTypesController.addVehicleType);
router.put("/:id", passwordProtect, vehicleTypesController.updateVehicleType);
router.delete(
    "/:id",
    passwordProtect,
    vehicleTypesController.deleteVehicleType
);

module.exports = router;
