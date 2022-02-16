const bodyParser = require('body-parser');
const express = require('express');
const helmet = require("helmet");
const axios = require('axios')
const cors = require('cors');

const config = require("./config.json");

const host = config.web.host || '127.0.0.1';
const port = config.web.port || 3000;
const app = express();

// set cross origin policy
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(helmet());
app.use(cors(corsOptions));  // use cors library
app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}));

// static routing paths for express
app.use(express.static('public'));

app.get('/nodes', (req, res) => {
  axios.get('https://explorer.conceal.network/pool/list?hasFeeAddr=true&isReachable=true').then(function (response) {
    console.log(response);
    if (response.data.success) {
      let resultArray = [];

      for (let i = 0; i < response.data.list.length; i++) {
        if (response.data.list[i].url) {
          resultArray.push(`${response.data.list[i].url.host || response.data.list[i].nodeHost}:${response.data.list[i].url.port || response.data.list[i].nodePort}`);
        } else {
          resultArray.push(`${response.data.list[i].nodeHost}:${response.data.list[i].nodePort}`);
        }
      }       

      // return the result
      res.json(resultArray);
    } else {
      res.json([]);
    }
  }).catch(function (error) {
    console.log(error);
  }).then(function () {
    // always executed
  });
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});