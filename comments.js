// Create web server
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(dbconfig);

// MySQL connect
connection.connect();

// Session
router.use(session({
    secret: 'asdf1234!@#$',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// Body-parser
router.use(bodyParser.urlencoded({ extended: false }));

// Web server start
router.get('/', function(req, res, next) {
    res.render('comments', { title: 'comments' });
});

// Load comments
router.post('/load', function(req, res, next) {
    var board_id = req.body.board_id;
    var sql = "SELECT * FROM comments WHERE board_id = ? ORDER BY id DESC";
    connection.query(sql, [board_id], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});

// Insert comments
router.post('/insert', function(req, res, next) {
    var board_id = req.body.board_id;
    var user_id = req.body.user_id;
    var contents = req.body.contents;
    var sql = "INSERT INTO comments (board_id, user_id, contents) VALUES (?, ?, ?)";
    connection.query(sql, [board_id, user_id, contents], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});

// Update comments
router.post('/update', function(req, res, next) {
    var id = req.body.id;
    var contents = req.body.contents;
    var sql = "UPDATE comments SET contents = ? WHERE id = ?";
    connection.query(sql, [contents, id], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});