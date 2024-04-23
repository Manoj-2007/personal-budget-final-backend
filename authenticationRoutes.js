// LoginAPI.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Manoj', 
    password: 'Manoj@2007',
    database: 'nbad_final_project'
});

const secretKey = 'BeginningIsTheEnding';

function transformDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateSalt() {
    return crypto.randomBytes(32).toString('hex');
}

function encryptPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

//API for signup
router.post('/api/signup', async (req, res) => {
    const { first_name, last_name, password, email, phone_number } = req.body;
    const salt = generateSalt();
    const hashedPassword = encryptPassword(password, salt);
    const date = transformDate(new Date());

    connection.query(
        'INSERT INTO user (first_name, last_name, password, salt, created_date, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, hashedPassword, salt, date, email, phone_number],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({success: false, error: error.sqlMessage });
            } else {
                res.json({status: 200, success: true, response: results });
            }
        }
    );
});

router.post('/api/login', async (req, res) => {
    const { password, email } = req.body;

    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve user' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                const hashedPassword = encryptPassword(password, user.salt);

                if (hashedPassword === user.password) {
                    const token = jwt.sign(
                        { email: user.email, userId: user.id },
                        secretKey,
                        { expiresIn: '5m' }
                    );

                    res.json({
                        success: true,
                        message: 'Login successful',
                        user: { email: user.email, first_name: user.first_name, last_name: user.last_name, user_id : user.id },
                        token: token
                    });
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect password' });
                }
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        }
    });
});

router.post('/api/logout', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        jwt.verify(token, secretKey);
        res.setHeader('Clear-Token', 'true');
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

router.post('/api/refreshToken', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const newAccessToken = jwt.sign(
            { email: decoded.email, userId: decoded.userId },
            secretKey,
            { expiresIn: '5m' }
        );
        res.json({ success: true, message: 'Token refreshed successfully', accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
});

module.exports = router;
