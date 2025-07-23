const express = require('express');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', { files });
    })
})

app.post('/create', (req, res) => {
    const data = req.body
    fs.writeFile(`./files/${data.title.replaceAll(" ", "")}.txt`, data.description, (err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect('/');
    })
})

app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename
    fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
        if(err){
            console.log(err.message);
        }
        res.render('fileview', {filename, data})
    })
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})