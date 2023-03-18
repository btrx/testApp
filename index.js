const express = require('express');
const { exec } = require('child_process');
const app = express();

const options = {
    maxBuffer: 1024 * 1024 * 10,
}

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/run-test', (req, res) => {
    const url = req.body.urlInput;
    process.env.URL = url;
    exec(`k6 run -e url test.js`, options, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send('Server error');
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.redirect('/result');
    });
});

app.get('/result', (req, res) => {
    res.sendFile(__dirname + '/result/result2.html');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});