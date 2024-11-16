require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Assume we fetch a users data from a database
const users = []

const otpStore = new Map();

const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw { status: 400, message: 'Username and password are required.' };
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            throw { status: 401, message: 'Invalid username or password.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw { status: 401, message: 'Invalid username or password.' };
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
    }
});

router.post('/request-otp', async (req, res, next) => {
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
});

router.post('/verify-otp', (req, res, next) => {
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
});


module.exports = router;