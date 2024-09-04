import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
    main();
})();

function main() {

    const server = new Server({
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
    });
    server.start();
}


// Buenas práctias con express (recomendado):
// https://expressjs.com/en/advanced/best-practice-performance.html 