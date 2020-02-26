const path = require("path");
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [
        new Dotenv()
    ]
};
