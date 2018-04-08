module.exports = (application) => {
    console.log("application.app.controllers fora =", application.app);
    application.post("/api/analisar", function (req, res){
        application.app.controllers.home.analisar(application, req, res);
    });
    application.get("/", function (req, res){
        console.log("application.app.controllers dentro =", application.app.controllers);
        application.app.controllers.home.render(application, req, res);
    });
}