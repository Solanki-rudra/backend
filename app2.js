const express = require('express');
const app = express();
const userModel = require('./2_ssr_crud/models/user')

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('index2');
})

app.get('/read', async (req, res) => {
    const users = await userModel.find()
    res.render('read2', { users });
})

app.post('/create', async (req, res) => {
    const { name, email, image } = req.body;
    await userModel.create({
        name,
        email,
        image
    })
    res.redirect('/read');
})

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.redirect('/read');
})

app.listen(3000, () => {
    console.log('App2 is running on port 3000');
});