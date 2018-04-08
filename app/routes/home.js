module.exports = (application) => {
    application.post("/api/analisar", (req, res) => {
        application.app.controllers.home.analisar(application, req, res);
    });
    application.get("/", (req, res) => {
        application.app.controllers.home.render(application, req, res);
    });
}