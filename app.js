const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DurkaDavid@922',
    database: 'app dropshipping'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.redirect('/shop');
});

// Customer Routes
app.get('/shop', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.render('shop', { products: results });
    });
});

app.get('/product/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE product_id = ?', [id], (err, result) => {
        if (err) throw err;
        res.render('product', { product: result[0] });
    });
});

app.post('/orderconfirmation', (req, res) => {
    const { product_id, order_quantity, customer_name, shipping_address } = req.body;
    db.query('SELECT price FROM products WHERE product_id = ?', [product_id], (err, result) => {
        if (err) throw err;
        const total_cost = result[0].price * order_quantity;
        const order_status = 'preparing';
        db.query('INSERT INTO orders (customer_id, product_id, date_of_order, order_status, total_cost, order_quantity, shipping_address) VALUES (?, ?, NOW(), ?, ?, ?, ?)', 
            [1, product_id, order_status, total_cost, order_quantity, shipping_address], (err) => {
            if (err) throw err;
            res.redirect('/shop');
        });
    });
});




app.get('/orderhistory', (req, res) => {
    const customerId = 1; // Assuming customer ID is 1 for demonstration purposes
    db.query('SELECT o.*, p.productName FROM orders o JOIN products p ON o.product_id = p.product_id WHERE customer_id = ?', [customerId], (err, results) => {
        if (err) throw err;
        res.render('orderHistory', { orders: results });
    });
});




const PORT = 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});