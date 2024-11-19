const { Fellow } = require('../models/model');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpStore = new Map();
const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

// Get User Profile (No authentication)
const getUserProfile = async (req, res) => {
    try {
        const { token } = req.query;

        const email  = jwt.verify(token, process.env.JWT_SECRET).mail;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Fellow.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ name: user.name, email: user.email, mobile: user.mobile });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const addFellow = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Name, email, and mobile are required' });
        }

        const existingFellow = await Fellow.findOne({ email });
        if (existingFellow) {
            return res.status(400).json({ message: 'Fellow with this email already exists' });
        }

        // Create a new user without manually hashing the password (it's done by the schema's pre-save hook)
        const newFellow = new Fellow({
            name,
            email,
            mobile,
        });

        console.log(newFellow);

        await newFellow.save();

        res.status(201).json({ message: 'Fellow created successfully', fellowId: newFellow._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Check if a Fellow exists with this email
        const fellow = await Fellow.findOne({ email });
        if (!fellow) {
            return res.status(403).json({ message: 'Fellow not found with this email.' });
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
        res.status(500).json({ message: 'Internal server error', error: error.message });

    }
}

const verifyOTP = async (req, res) => {
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
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }

}


module.exports = { getUserProfile, addFellow, requestOTP, verifyOTP };
