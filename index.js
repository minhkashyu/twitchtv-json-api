'use strict';

const express = require('express');
const app = express();
require('dotenv').config({ silent: true });

app.set('view options', { layout: false });
app.use(express.static(__dirname + '/public'));

let port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.render('/public/index.html');
});

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('The server is listening on ' + port + '...');
});