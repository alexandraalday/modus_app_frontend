const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 2000;


app.use(express.static('public'));
require('dotenv').config();

app.listen(PORT, () => console.log('modus frontend running on port: ', PORT));
