const { Fellow } = require('../models/model');
require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpStore = new Map();
const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

// Get User Profile (No authentication)
const getUserProfile = async (req, res) => {
    try {
        // Example: Fetching user based on email passed in query parameters
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Fetch user details from the database
        const user = await Fellow.findOne({ email }).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's name and email
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Add User (Create a new user)
const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if a user with the same email already exists
        const existingUser = await Fellow.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a new user without manually hashing the password (it's done by the schema's pre-save hook)
        const newUser = new Fellow({
            name,
            email,
            passwordHash: password, // The password will be hashed automatically in the schema
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login User (Authenticate using email and password)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await Fellow.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password with the stored hash
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate and return JWT or other session tokens here
        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const requestOTP = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            throw { status: 400, message: 'Username and email are required.' };
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

        // Store OTP with expiration
        otpStore.set(email, { otp, expiresAt });

        // Send OTP via email (or SMS with Twilio)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.SENDER_MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: 'Your TAFEA OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (err) {
        next(err);
    }
}

const verifyOTP = async (req, res, next) => {
    try {
        const { mail, otp } = req.body;

        // Validate input
        if (!mail || !otp) {
            throw { status: 400, message: 'Mail and OTP are required.' };
        }

        // Check if OTP exists and is valid
        const storedOtp = otpStore.get(mail);
        if (!storedOtp || storedOtp.expiresAt < Date.now()) {
            throw { status: 400, message: 'OTP has expired or is invalid.' };
        }

        if (parseInt(otp, 10) !== storedOtp.otp) {
            throw { status: 401, message: 'Invalid OTP.' };
        }

        const jwt_secret = process.env.JWT_SECRET;

        const token = jwt.sign({ mail }, jwt_secret, { expiresIn: '1h' });

        otpStore.delete(mail);

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
    }

}


module.exports = { getUserProfile, addUser, loginUser, requestOTP, verifyOTP };
