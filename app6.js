const express = require('express');
const { userModel } = require('./6_mini_project/models/user');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { postModel } = require('./6_mini_project/models/post');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(12).toString('hex') + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.render('index6');
});

app.post('/register', async (req, res) => {
    const { username, name, password, email, age } = req.body;
    const user = await userModel.findOne({ email })
    if (user) return res.status(400).send('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
        username,
        name,
        password: hashedPassword,
        email,
        age
    })
    const token = jwt.sign({ email, user_id: newUser._id }, 'secretkey')
    res.cookie('token', token)
    res.send(newUser)
})

app.get('/login', (req, res) => {
    res.render('login6');
})

app.post('/upload-img', upload.single('image'), async (req, res) => {
    console.log(req.file);
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(400).send('Invalid password');
    const token = jwt.sign({ email, user_id: user._id }, 'secretkey');
    res.cookie('token', token)
    res.redirect('/profile');
    res.send('login successfully')
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/login')
})

app.get('/profile', isLogedIn, async (req, res) => {
    const user = await userModel.findById(req.user.user_id).populate('posts');
    if (!user) return res.status(404).send('User not found');
    res.render('profile6', { user })
})

app.post('/post/create', isLogedIn, async (req, res) => {
    const { content } = req.body;
    const user = await userModel.findById(req.user.user_id);
    const post = await postModel.create({
        content,
        user_id: user.user_id
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
})

app.get('/post/delete/:id', isLogedIn, async (req, res) => {
    const user = await userModel.findById(req.user.user_id);
    if(user.posts.includes(req.params.id)) {
        user.posts = user.posts.filter(postId => postId.toString() !== req.params.id);
        await user.save();
    }else{
        return res.status(404).send('Post not found for this user');
    }
    await postModel.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
})

app.get('/post/edit/:id', async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.render('edit6', { post });
});

app.post('/post/edit/:id', isLogedIn, async (req, res) => {
    const { content } = req.body;
    await postModel.findByIdAndUpdate(req.params.id, {content});
    res.redirect('/profile');
})

app.post('/post/like/:id', isLogedIn, async (req, res) => { 
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    if (post.likes.includes(req.user.user_id)) {
        post.likes = post.likes.filter(userId => userId.toString() !== req.user.user_id);
    } else {
        post.likes.push(req.user.user_id);
    }
    await post.save();
    res.redirect('/profile');
})

function isLogedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Unauthorized');
    const data = jwt.verify(token, 'secretkey');
    if (!data) return res.status(401).send('Unauthorized');
    req.user = data
    next();
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});