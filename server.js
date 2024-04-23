const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const port = process.env.PORT || 4219;
const app = express();
app.use(cors());

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

app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

const closeMysqlConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed');
        }
    });
};

const loginRoutes = require('./authenticationRoutes');
app.use('/', loginRoutes);

app.get('/', async (req, res) => {
        res.status(200).json({success : true, message : 'Everything is Good.'});
});

const server = app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

// Close the server and MySQL connection when the tests are finished
process.on('exit', () => {
    server.close();
    closeMysqlConnection();
    console.log('Server and MySQL connection closed');
});

module.exports = app;