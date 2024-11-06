/** Server for WallStreetSim. */

const app = require('./app');
const { PORT } = require("./config");

app.listen(PORT, function () {
    console.log(`started on http://localhost:${PORT}`);
});