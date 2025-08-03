const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('./4_auth_form/models/user');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index4');
});

app.post('/create', async (req, res) => {
    const { username, email, password, number } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({ username, email, password: hashedPassword, number });
    const token = jwt.sign(email, 'secretkey')
    res.cookie('token', token);
    res.send(createdUser);
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('login4');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign(email, 'secretkey')
    res.cookie('token', token);
    res.send('Login successful');
    console.log(user)

})

app.get('/token', (req, res) => {
    const token = req.cookies.token;
    console.log('token', token);
    const data = jwt.verify(token, 'secretkey');
    console.log('data', data);
    res.send(data);
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
