var express = require('express');
var app = express();
const cors = require("cors");
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;
const fs = require('fs')
const path = require('path')
const uuid = require('uuid').v4
var session = require("express-session");


app.use(cors({ origin: 'localhost:3000', credentials: true }))
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.raw({ type: 'audio/webm', limit: '50mb' }));
app.use(session({
    secret: "ThisIsTopSeceretSoYouShallNotTellAnyOne",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}
));


app.post("/api/whatWords", (req, res) => {
    console.log("writing")
    let filename = path.join(__dirname, "recording", uuid())
    fs.writeFile(filename + '.webm', req.body, async (err) => {
        let spawn = require("child_process").spawn;
        let process = spawn('ffmpeg', ["-y", "-i", filename + ".webm",
            filename + ".wav"], { cwd: __dirname });
        process.stdout.on('data', function (data) {
            console.log(data.toString())
        });
        process.on('exit', (code) => {
            console.log('exit code for ffmpeg', code)
            let process2 = spawn('python', ["./cores/test.py",
                filename + ".wav"], { cwd: __dirname });

            process2.stdout.on('data', function (data) {
                console.log('the converted text is ', data.toString());
                res.send({ text: data.toString() })
            })

            process2.stderr.on('data', (err) => {
                console.log('some problem here,', err.toString())
            })
        });
    })
})

app.listen(port, () => {
    console.log(`listining on port ${port}`);
});
