import { Router } from "express";
import { TodoRoutes } from "./todos/routes";


export class AppRoutes {

    private static baseUrl_v1 = '/api';


    static get routes(): Router {
        const router = Router();

        router.use(this.baseUrl_v1 + '/todos', TodoRoutes.routes);

        return router;
    }
}