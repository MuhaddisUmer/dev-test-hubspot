const path = require('path');
const cors = require('cors');
const express = require('express');
const compression = require('compression');

let app = express();
let port = process.env.PORT || 4000;

app.use(cors());
app.use(compression());
app.use(express.static(__dirname + '/build'));
app.get('*', (req, res) => res.sendFile(path.normalize(__dirname + '/build/index.html')));

app.listen(port,() => console.log(`listening to ${port}`));
