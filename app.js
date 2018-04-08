let app = require("./config/server.js");

//Set the available port or 3000
let server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
//Set the available host
let server_host = process.env.YOUR_HOST || '0.0.0.0';

try {
    app.listen(server_port, server_host, () => {
    }).on("error", (error) => {
        console.log("analise-fundamentalista server error =", error);
    }).on("listening", () => {
        console.log("analise-fundamentalista online");
    }).on("request", (request) => {
        console.log("analise-fundamentalista received a new request.");
        //console.log("request =", request.headers);
    });

} catch (error) {
    console.log("Error on crodity-posts, error =", error);
}

//Process events
process.on("uncaughtException", (error) => {
    console.log("Application closing due an uncaughtException...");
    console.log("Error =", error);
});