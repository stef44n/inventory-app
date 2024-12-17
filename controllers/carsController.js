// controllers/carsController.js
const pool = require("../db/pool");

// GET: Retrieve all cars with their model, make, and vehicle type info
exports.getAllCars = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT cars.car_id, cars.yr, cars.license_plate, cars.mileage, cars.status, car_models.model_name, makes.make_name, vehicle_types.vehicle_type_name
      FROM cars
      JOIN car_models ON cars.model_id = car_models.model_id
      JOIN makes ON car_models.make_id = makes.make_id
      JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.vehicle_type_id
    `);
        res.render("cars", { cars: result.rows }); // Render the cars.ejs view
        // res.status(200).json(result.rows); // Send all cars as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Retrieve cars form
exports.newCarForm = async (req, res) => {
    try {
        const models = await pool.query("SELECT * FROM car_models");
        const vehicleTypes = await pool.query("SELECT * FROM vehicle_types");
        res.render("new-car", {
            models: models.rows,
            vehicleTypes: vehicleTypes.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Retrieve a single car by ID
exports.getCarById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the car details from the database
        const carResult = await pool.query(
            `SELECT cars.*, car_models.model_name, makes.make_name, vehicle_types.vehicle_type_name
       FROM cars
       JOIN car_models ON cars.model_id = car_models.model_id
       JOIN makes ON car_models.make_id = makes.make_id
       JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.vehicle_type_id
       WHERE cars.car_id = $1`,
            [id]
        );

        if (carResult.rows.length === 0) {
            return res.status(404).json({ error: "Car not found" });
        }

        const car = carResult.rows[0];

        // Render a view showing the car details
        res.render("car-details", { car });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Show the form to edit a car
exports.editCar = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the car details for editing
        const carResult = await pool.query(
            `SELECT cars.*, car_models.model_name, makes.make_name, vehicle_types.vehicle_type_name
       FROM cars
       JOIN car_models ON cars.model_id = car_models.model_id
       JOIN makes ON car_models.make_id = makes.make_id
       JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.vehicle_type_id
       WHERE cars.car_id = $1`,
            [id]
        );

        const vehicleTypesResult = await pool.query(
            "SELECT * FROM vehicle_types"
        );
        const modelsResult = await pool.query("SELECT * FROM car_models");

        if (carResult.rows.length === 0) {
            return res.status(404).json({ error: "Car not found" });
        }

        const car = carResult.rows[0];
        const vehicleTypes = vehicleTypesResult.rows;
        const models = modelsResult.rows;

        // Render the edit form
        res.render("edit-car", { car, vehicleTypes, models });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Add a new car to the inventory
exports.addCar = async (req, res) => {
    const { model_id, vehicle_type_id, yr, license_plate, mileage, status } =
        req.body;

    try {
        await pool.query(
            "INSERT INTO cars (model_id, vehicle_type_id, yr, license_plate, mileage, status) VALUES ($1, $2, $3, $4, $5, $6)",
            [model_id, vehicle_type_id, yr, license_plate, mileage, status]
        );
        res.redirect("/cars"); // Redirect back to the cars list page
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update an existing car by ID
exports.updateCar = async (req, res) => {
    const { id } = req.params;
    const { model_id, vehicle_type_id, yr, license_plate, mileage, status } =
        req.body;

    try {
        // Update the car details in the database
        await pool.query(
            `UPDATE cars
       SET model_id = $1, vehicle_type_id = $2, yr = $3, license_plate = $4, mileage = $5, status = $6
       WHERE car_id = $7`,
            [model_id, vehicle_type_id, yr, license_plate, mileage, status, id]
        );

        // Redirect back to the car details page
        res.redirect(`/cars/${id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a car by ID
exports.deleteCar = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the car from the database
        await pool.query("DELETE FROM cars WHERE car_id = $1", [id]);

        // Redirect to the cars list after deletion
        res.redirect("/cars");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
