const express = require('express');
const axios = require("axios");
const qs = require("qs");
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "*",
}));
const port = process.env.PORT || 8383;

app.use(express.json());

let _code, _lang, _input, _output;

app.get('/', (req, res) => {
    console.log("this is get normal");
    res.status(200).send("Hello world");
});

app.post('/submit', async (req, res) => {
    try {
        const { problem, code, input } = req.body;
        _code = code;
        _lang = 'java'; // Assuming Java is the language
        _input = input;

        if (!_code || !_lang || !_input) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        var postData = qs.stringify({
            code: _code,
            language: _lang,
            input: _input
        });

        var config = {
            method: "post",
            url: "https://api.codex.jaagrav.in",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: postData,
        };

        const response = await axios(config);
        _output = response.data;

        if (_output.status === 200) {
            if (_output.error === "") {
                res.status(200).send(_output.output);
            } else {
                res.status(200).send(_output.error);
            }
        } else {
            res.status(_output.status).send(_output.error);
        }
    } catch (error) {
        console.error("Error in /submit:", error);
        res.status(500).send("An error occurred while processing your request");
    }
});

app.listen(port, () => console.log(`Server has started on port ${port}`));
