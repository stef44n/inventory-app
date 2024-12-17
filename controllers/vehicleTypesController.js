// controllers/vehicleTypesController.js
const pool = require("../db/pool");

// GET: Retrieve all vehicle types
exports.getAllVehicleTypes = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM vehicle_types");
        res.render("vehicle-types", { vehicleTypes: result.rows }); // Render the vehicle-types.ejs view
        // res.status(200).json(result.rows); // Send the result back as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Fetch all cars for a specific vehicle type
exports.getCarsByVehicleType = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the selected vehicle type
        const vehicleTypeResult = await pool.query(
            "SELECT * FROM vehicle_types WHERE vehicle_type_id = $1",
            [id]
        );

        if (vehicleTypeResult.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle type not found" });
        }

        // Fetch all cars for this vehicle type
        const carsResult = await pool.query(
            `SELECT cars.*, car_models.model_name, makes.make_name 
       FROM cars 
       JOIN car_models ON cars.model_id = car_models.model_id 
       JOIN makes ON car_models.make_id = makes.make_id
       WHERE cars.vehicle_type_id = $1`,
            [id]
        );

        const vehicleType = vehicleTypeResult.rows[0];
        const cars = carsResult.rows;

        // Render a view showing the cars of this vehicle type
        res.render("cars-by-vehicle-type", { vehicleType, cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Retrieve vehicle types form
exports.newVehicleTypeForm = async (req, res) => {
    res.render("new-vehicle-type");
};

// POST: Add a new vehicle type
exports.addVehicleType = async (req, res) => {
    const { vehicle_type_name } = req.body;

    if (!vehicle_type_name) {
        return res.status(400).json({ error: "Vehicle type name is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO vehicle_types (vehicle_type_name) VALUES ($1) RETURNING *",
            [vehicle_type_name]
        );
        res.redirect("/vehicle-types");
        console.log(result.rows[0]);
        // res.status(201).json(result.rows[0]); // Return the newly created vehicle type
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Render the form to edit an existing vehicle type
exports.renderEditVehicleTypeForm = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM vehicle_types WHERE vehicle_type_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle type not found" });
        }

        res.render("edit-vehicle-type", { vehicleType: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update a vehicle type by ID
exports.updateVehicleType = async (req, res) => {
    const { id } = req.params;
    const { vehicle_type_name } = req.body;

    try {
        await pool.query(
            "UPDATE vehicle_types SET vehicle_type_name = $1 WHERE vehicle_type_id = $2",
            [vehicle_type_name, id]
        );
        res.redirect("/vehicle-types");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a vehicle type by ID
exports.deleteVehicleType = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the vehicle type (cars will be deleted automatically due to ON DELETE CASCADE)
        await pool.query(
            "DELETE FROM vehicle_types WHERE vehicle_type_id = $1",
            [id]
        );

        // Redirect back to the list of vehicle types after deletion
        res.redirect("/vehicle-types");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
