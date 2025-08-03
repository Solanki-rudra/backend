const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cookieParser());


app.get('/', (req, res) => {
    const token = jwt.sign({ email: 'rudra@gmail.com' }, 'secretkey')
    res.cookie('name', 'Rudra');
    res.cookie('token', token);
    res.send('Hello World!');
});

app.get('/read-cookie', (req, res) => {
    const cookie = req.cookies.name
    console.log(cookie);
})

app.get('/password', (req, res) => {
    const myPlaintextPassword = 'terabhaiseedhemaut4life';
    const saltRounds = 10;
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        if (err) {
            console.error(err);
            res.status(500).send('Error hashing password');
        }
        console.log(hash);
        res.cookie('passwordHash', hash);
        res.send('Password hashed successfully');
    });
})

app.get('/verify-password', (req, res) => {
    const myPlaintextPassword = 'terabhaiseedhemaut4life';
    const hash = '$2b$10$V5lNiQY1r4YoTwS2nOZ.EOj7KUdpds0duwRW8FGCG/2MpokeFHymq';
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error verifying password');
        }
        console.log(result); // true if the password matches
        res.send(`Password verification result: ${result}`);
    });
})

app.get('/verify-token', (req, res) => {
    const token = req.cookies.token;
    const data = jwt.verify(token, 'secretkey')
    console.log(data);
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});