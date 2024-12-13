const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Validate input
        if (!(firstname && lastname && email && password)) {
            return res.status(400).json({ 
                success: false,
                message: "All input fields are required" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: "User already exists. Please login" 
            });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptedPassword,
            subscriptionType: 'free',
            features: ['base_plan']
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: "24h" }
        );

        // Return new user with token
        res.status(201).json({
            success: true,
            token: `Bearer ${token}`,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                subscriptionType: user.subscriptionType,
                features: user.features
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: "Validation Error", 
                details: err.message 
            });
        }
        if (err.code === 11000) {
            return res.status(409).json({ 
                success: false,
                message: "Email already in use" 
            });
        }
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            details: err.message 
        });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!(email && password)) {
            return res.status(400).json({ 
                success: false,
                message: "All input fields are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { 
                    user_id: user._id, 
                    email,
                    subscriptionType: user.subscriptionType  // Include subscription in token
                },
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: "24h" }
            );

            // Return user with token
            res.status(200).json({
                success: true,
                token: `Bearer ${token}`,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    subscriptionType: user.subscriptionType,
                    features: user.features
                }
            });
        } else {
            res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            details: err.message 
        });
    }
});

module.exports = router;