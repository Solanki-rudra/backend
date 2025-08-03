const express = require('express');
const app = express();

const userModel = require('./5_data_assosiation/models/user')
const tweetModel = require('./5_data_assosiation/models/tweet')

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/create', async (req, res) => {
    const user = await userModel.create({
        username: 'john_doe',
        password: 'password123',
        age: 30
    })
    res.send(user);
})

app.get('/tweet/create', async (req, res) => {
    const tweet = await tweetModel.create({
        content: 'This is my first tweet!',
        user: '688f55f0d4a9a7109ac4d880',
    })
    const user = await userModel.findById('688f55f0d4a9a7109ac4d880')
    user.tweets.push(tweet._id);
    await user.save();
    res.send({ tweet, user })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});