import express from "express";
var app = express();
app.use(express.json({limit: '50mb'}));
const port = 5009

import Mercury from "@postlight/mercury-parser";
// import pkg from 'node-html-parser';
// const { parse } = pkg;

app.post('/process', function (req, res) {
    if (req.body.url && req.body.html) {
        Mercury.parse(req.body.url, {
            html: req.body.html
        }).then(result => {
//             var root = parse(result.content);
            res.send({
                data: result
            });
        });
    }
    else {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
