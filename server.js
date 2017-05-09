let http = require ("http");
let fs = require ("fs");
let VKApi = require ("node-vkapi");
let express = require('express');

let app = express();
let VK = new VKApi({});

app.use(express.static(__dirname));

app.get("/getCatalogInfo", function(req, res) {
    VK.auth.user({scope: ["groups"]}).then(() => {
        VK.call('groups.getCatalogInfo', {
            extended: "0",
        }).then(data => {
            res.send(data);
        });
    });
});

app.get("/getCatalog", function(req, res) {
    VK.call('groups.getCatalog', {
        category_id: req.query.category_id,
    }).then(data => {
        res.send(data);
    });
});

app.get("/searchGroups", function(req, res) {
    VK.call('groups.search', {
        q: req.query.text,
    }).then(data => {
        res.send(data);
    });
});

app.listen(3000);