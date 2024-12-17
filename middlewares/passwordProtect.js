// passwordProtect.js
module.exports = (req, res, next) => {
    const enteredPassword = req.body.password; // Password entered in the request
    const actualPassword =
        process.env.ACTION_PASSWORD || "your_default_password"; // Store in .env for security

    if (enteredPassword === actualPassword) {
        next(); // If password matches, proceed to the route
    } else {
        res.status(401).send("Unauthorized: Incorrect password"); // If not, block access
    }
};
