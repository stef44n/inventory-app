// controllers/makesController.js
const pool = require("../db/pool");

// GET: Retrieve all car makes
exports.getAllMakes = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM makes");
        res.render("makes", { makes: result.rows }); // Render the makes.ejs view

        // res.status(200).json(result.rows); // Send all makes as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Fetch all cars for a specific make
exports.getCarsByMake = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the selected make
        const makeResult = await pool.query(
            "SELECT * FROM makes WHERE make_id = $1",
            [id]
        );

        if (makeResult.rows.length === 0) {
            return res.status(404).json({ error: "Make not found" });
        }

        // Fetch all cars for this make
        const carsResult = await pool.query(
            `SELECT cars.*, car_models.model_name, vehicle_types.vehicle_type_name
       FROM cars 
       JOIN car_models ON cars.model_id = car_models.model_id 
       JOIN makes ON car_models.make_id = makes.make_id
       JOIN vehicle_types ON cars.vehicle_type_id = vehicle_types.vehicle_type_id
       WHERE makes.make_id = $1`,
            [id]
        );

        const make = makeResult.rows[0];
        const cars = carsResult.rows;

        // Render a view showing the cars of this make
        res.render("cars-by-make", { make, cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Retrieve makes form
exports.newMakeForm = async (req, res) => {
    res.render("new-make");
};

// GET: Show the edit form for a car make
exports.editMake = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the make to edit
        const makeResult = await pool.query(
            "SELECT * FROM makes WHERE make_id = $1",
            [id]
        );

        if (makeResult.rows.length === 0) {
            return res.status(404).json({ error: "Make not found" });
        }

        const make = makeResult.rows[0];

        // Render the edit form view
        res.render("edit-make", { make });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Add a new car make
exports.addMake = async (req, res) => {
    const { make_name } = req.body;

    if (!make_name) {
        return res.status(400).json({ error: "Car make name is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO makes (make_name) VALUES ($1) RETURNING *",
            [make_name]
        );
        res.redirect("/makes");
        console.log(result.rows[0]);
        // res.status(201).json(result.rows[0]); // Return the newly created car make
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update an existing car make by ID
exports.updateMake = async (req, res) => {
    const { id } = req.params;
    const { make_name } = req.body;

    try {
        // Update the make in the database
        await pool.query("UPDATE makes SET make_name = $1 WHERE make_id = $2", [
            make_name,
            id,
        ]);

        // Redirect back to the list of makes
        res.redirect("/makes");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a car make by ID
exports.deleteMake = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the make (models and cars will be deleted automatically due to ON DELETE CASCADE)
        await pool.query("DELETE FROM makes WHERE make_id = $1", [id]);

        // Redirect back to the list of makes after deletion
        res.redirect("/makes");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
