// BudgetRoutes.js

const express = require('express');
const app = express.Router();
const mysql = require('mysql');
const { expressjwt: expressJwt } = require('express-jwt');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Manoj', 
    password: 'Manoj@2007',
    database: 'nbad_final_project'
});

const secretKey = 'BeginningIsTheEnding'

const jwtMiddleware = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.post('/api/addExpense', jwtMiddleware, (req, res) => {
    // Only authenticated users can access this endpoint due to jwtMiddleware
    const userId = req.auth.userId; // Extract userId from the decoded token
    const { date, categoryName, categoryId, amount } = req.body;

    // Validate the expense data
    if (!date || !categoryName || !categoryId || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid expense data' });
    }

    // Save the expense to the MySQL database
    const sql = 'INSERT INTO expenses (userId, date, categoryid, categoryName, amount) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, date, categoryId, categoryName, amount]; // Fixed category to categoryId

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error.sqlMessage });
        }

        const newExpense = {
            id: results.insertId,
            userId,
            date,
            categoryId, // Updated to categoryId
            categoryName, // Added categoryName
            amount
        };

        res.json({ success: true, message: 'Expense added successfully', expense: newExpense });
    });
});

app.get('/api/getExpenses', jwtMiddleware, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { date } = req.query; // Use req.query instead of req.body for GET requests

        // Validate the date parameter
        if (!date) {
            return res.status(400).json({ success: false, message: 'Date parameter is required' });
        }

        // Assuming your expenses table is named 'expenses'
        const sql = 'SELECT id, date, categoryName, amount FROM expenses WHERE userId = ? AND date = ?';
        const values = [userId, date];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
            } else {
                res.json({ success: true, expenses: results });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.delete('/api/deleteExpense/:expenseId', jwtMiddleware, (req, res) => {
    // Only authenticated users can access this endpoint due to jwtMiddleware
    const userId = req.auth.userId; // Extract userId from the decoded token
    const expenseId = req.params.expenseId;

    // Validate the expenseId parameter
    if (!expenseId || isNaN(expenseId)) {
        return res.status(400).json({ success: false, message: 'Invalid expenseId parameter' });
    }

    // Delete the expense from the MySQL database
    const sql = 'DELETE FROM expenses WHERE id = ? AND userId = ?';
    const values = [expenseId, userId];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Failed to delete expense' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.json({ success: true, message: 'Expense deleted successfully' });
    });
});

module.exports = app;

