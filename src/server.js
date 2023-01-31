const { PORT = 4500 } = process.env;
const app = require("./app");
const listener = () => console.log(`....Listening to sever on port ${PORT}`);

app.listen(PORT, listener);
