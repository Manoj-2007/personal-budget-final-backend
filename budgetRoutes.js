// BudgetRoutes.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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

// Endpoint for getting all budgets for a user
router.get('/api/budgets', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;

    connection.query(
        'SELECT * FROM user_budgets WHERE user_id = ?',
        [userId],
        (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get budgets' });
        } else {
            res.json(results);
        }
        }
    );
});

router.post('/api/add-budget', jwtMiddleware, (req, res) => {
    // Only authenticated users can access this endpoint due to jwtMiddleware
    const userId = req.auth.userId; // Extract userId from the decoded token
    var { category, budget_amount } = req.body;

    category = category.toLowerCase();
    // Validate the budget data
    if (!category || typeof budget_amount !== 'number' || budget_amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid budget data' });
    }

    // Save the budget to the MySQL database
    const sql = 'INSERT INTO user_budgets (user_id, category, budget_amount) VALUES (?, ?, ?)';
    const values = [userId, category, budget_amount];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error.sqlMessage });
        }

        const newBudget = {
            id: results.insertId,
            userId,
            category,
            budget_amount
        };

        res.json({ success: true, message: 'Budget added successfully', budget: newBudget });
    });
});

router.delete('/api/delete-budget/:budgetId', jwtMiddleware, (req, res) => {
    // Only authenticated users can access this endpoint due to jwtMiddleware
    const userId = req.auth.userId; // Extract userId from the decoded token
    const budgetId = req.params.budgetId;

    // Validate the budgetId parameter
    if (!budgetId || isNaN(budgetId)) {
        return res.status(400).json({ success: false, message: 'Invalid budgetId parameter' });
    }

    // Delete the budget from the MySQL database
    const sql = 'DELETE FROM user_budgets WHERE id = ? AND user_id = ?';
    const values = [budgetId, userId];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Failed to delete budget' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
        }

        res.json({ success: true, message: 'Budget deleted successfully' });
    });
});

module.exports = router;
