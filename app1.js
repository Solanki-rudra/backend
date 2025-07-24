const express = require('express');
const app = express();
const userModel = require('./1_basic_crud/usermodel');

app.get('/', async (req, res) => {
    const user = await userModel.create({
        name: 'John Doe',
        email: 'johen@dsfs.cd',
        age: 30
    })
    console.log(user);
});

app.get('/update', async (req, res) => {
    const user = await userModel.findOneAndUpdate({ name: 'John Doe' }, 
    { age: 31 }, { new: true });
    console.log(user);
})

app.get('/read', async (req, res) => {
    const users = await userModel.find();
    console.log(users);
})
app.get('/delete', async (req, res) => {
    const user = await userModel.findOneAndDelete({ name: 'John Doe' });
    console.log(user);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});