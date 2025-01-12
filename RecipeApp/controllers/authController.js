const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();


exports.signup = async(req, res) => {
    const { username, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,

        });

        // Save the user to the database
        await newUser.save();


        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.signin = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials." });
        }

        // Check if the password exists in the database
        if (!user.password) {
            return res.status(500).json({ message: "Password is not set for this user." });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong credentials." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send response
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during signin:", error.message || error);
        res.status(500).json({ message: "Server error." });
    }
};