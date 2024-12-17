// controllers/modelsController.js
const pool = require("../db/pool");

// GET: Retrieve all car models
exports.getAllModels = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT car_models.model_id, car_models.model_name, makes.make_name
      FROM car_models
      JOIN makes ON car_models.make_id = makes.make_id
    `);

        res.render("models", { models: result.rows }); // Render the models.ejs view

        // res.status(200).json(result.rows); // Send all car_models as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Fetch all cars for a specific model
exports.getCarsByModel = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the selected model
        const modelResult = await pool.query(
            "SELECT * FROM car_models WHERE model_id = $1",
            [id]
        );

        if (modelResult.rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }

        // Fetch all cars for this model
        const carsResult = await pool.query(
            `SELECT cars.*, car_models.model_name, makes.make_name, vehicle_types.vehicle_type_name
       FROM cars 
       JOIN car_models ON cars.model_id = car_models.model_id 
       JOIN makes ON car_models.make_id = makes.make_id
       JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.vehicle_type_id
       WHERE car_models.model_id = $1`,
            [id]
        );

        const model = modelResult.rows[0];
        const cars = carsResult.rows;

        // Render a view showing the cars of this model
        res.render("cars-by-model", { model, cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Retrieve models form
exports.newModelForm = async (req, res) => {
    try {
        const makes = await pool.query("SELECT * FROM makes");
        res.render("new-model", { makes: makes.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Show the edit form for a car model
exports.editModel = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the model to edit
        const modelResult = await pool.query(
            "SELECT * FROM car_models WHERE model_id = $1",
            [id]
        );
        const makesResult = await pool.query("SELECT * FROM makes"); // Get all makes for selection

        if (modelResult.rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }

        const model = modelResult.rows[0];
        const makes = makesResult.rows;

        // Render the edit form
        res.render("edit-model", { model, makes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Add a new car model
exports.addModel = async (req, res) => {
    const { model_name, make_id } = req.body;

    try {
        await pool.query(
            "INSERT INTO car_models (model_name, make_id) VALUES ($1, $2)",
            [model_name, make_id]
        );
        res.redirect("/models"); // Redirect back to the models list page
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update an existing car model by ID
exports.updateModel = async (req, res) => {
    const { id } = req.params;
    const { model_name, make_id } = req.body;

    try {
        // Update the car model in the database
        await pool.query(
            "UPDATE car_models SET model_name = $1, make_id = $2 WHERE model_id = $3",
            [model_name, make_id, id]
        );

        // Redirect back to the cars for this model
        res.redirect(`/models/${id}/cars`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a car model by ID
exports.deleteModel = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the model (cars will be deleted automatically due to ON DELETE CASCADE)
        await pool.query("DELETE FROM car_models WHERE model_id = $1", [id]);

        // Redirect back to the list of models after deletion
        res.redirect("/models");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
