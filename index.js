const express = require('express')
var axios = require("axios")
var qs = require("qs");
const cors = require("cors")
const app = express()

app.use(cors({
    origin: "*",
}))


const port = process.env.PORT || 8383

// app.use(express.static('../Frontend'))
app.use(express.json())

var _code, _lang, _input, _output
app.get('/', (req, res) => {
    console.log("this is get normal")
    res.status(200).send("Hello world")
})


//Don't use this one . It is errorneous
app.get('/getOutput', (req, res) => {
    var postData = qs.stringify({
        code: _code,
        language: _lang,
        input: _input
    })
    console.log("data : ", postData)
    var config = {
        method: "post",
        url: "https://api.codex.jaagrav.in",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: postData,
    }

    axios(config)
        .then(function (res) {
            // console.log(res.data)
            _output = JSON.stringify(res.data)
            res.data = {}
            return _output
        })
        .then(() => {

            console.log("output : ", _output)
            if ((JSON.parse(_output)).status == 200) {
                if ((JSON.parse(_output)).error == "") {
                    res.status(200).send({ getOutput: (JSON.parse(_output)).output })
                }
                else {
                    res.status(200).send({ getOutput: (JSON.parse(_output)).error })
                }
            }
            else {
                res.send({ getOutput: (JSON.parse(_output)).error })
            }
        })
        .catch((error) => {
            console.log(error);
            // console.log("punki")
        });
})

// This will serve all requests
app.post('/', (req, res) => {
    // Forme the data for further use from the request from user
    const { code } = req.body
    const { language } = req.body
    const { input } = req.body

    // console.log("check : ",req.body)

    _code = code
    _lang = language
    _input = input

    if (_code != undefined && _lang != undefined && _input != undefined) {
        let dmd = JSON.stringify({
            a: _code,
            b: _lang,
            c: _input
        })
        // console.log("post : ",dmd)
        // res.status(200).send(dmd)
    }
    else {
        console.log("error")
        // res.send("error")
    }

    // Post The data

    var postData = qs.stringify({
        code: _code,
        language: _lang,
        input: _input
    })
    // console.log("data : ", postData)
    var config = {
        method: "post",
        url: "https://api.codex.jaagrav.in",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: postData,
    }

    axios(config)
        .then(function (res) {
            // console.log(res.data)
            _output = JSON.stringify(res.data)
            res.data = {}
            return _output
        })
        .then(() => {
            // console.log("output : ",_output)
            if ((JSON.parse(_output)).status == 200) {
                if ((JSON.parse(_output)).error == "") {
                    res.status(200).send({ getOutput: (JSON.parse(_output)).output })
                }
                else {
                    res.status(200).send({ getOutput: (JSON.parse(_output)).error })
                }
            }
            else {
                res.send({ getOutput: (JSON.parse(_output)).error })
            }
        })
        .catch((error) => {
            res.send({getOutput : "Please write code in the editor!"})
        });
})

app.listen(port, () => console.log(`Server has started on port ${port}`))

