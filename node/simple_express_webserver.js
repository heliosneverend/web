const path = require("path");
const express = require("express");
//const express = require("./myExpress/express");
const fs = require("fs");
const url = require("url");
const { allowedNodeEnvironmentFlags } = require("process");

const app = express();
const port = 3000;

app.get('./', (req, res) => {
    res.send('hello world')
});
app.get('api/users', (req, res) => {
    const resData = [
        {
          id: 1,
          name: "小明",
          age: 18,
        },
        {
          id: 2,
          name: "小红",
          age: 19,
        },
      ];
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(resData));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})