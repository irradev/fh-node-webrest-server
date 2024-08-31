import { Router } from "express";
import { TodoRoutes } from "./todos/routes";


export class AppRoutes {

    private static baseUrl = '/api';


    static get routes(): Router {
        const router = Router();

        router.use(this.baseUrl + '/todos', TodoRoutes.routes);

        return router;
    }
}