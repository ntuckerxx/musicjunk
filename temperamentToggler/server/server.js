const path = require('path');
const express = require('express');
const app = express();
const port = 3666;
const cors = require('cors');

let publicPath = path.join(__dirname, '../public');
console.log('publicPath: ', publicPath);
app.use(cors());
app.use('/', express.static(publicPath));


app.listen(port, () => {
  console.log(`app listening ern port ${port}`);
});

