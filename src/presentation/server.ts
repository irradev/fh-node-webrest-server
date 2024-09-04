import express, { Router } from 'express';
import path from 'path';
import compression from 'compression';

interface Options {
    port: number;
    routes: Router;
    publicPath?: string;
}

export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        this.port = options.port;
        this.publicPath = options.publicPath || 'public';
        this.routes = options.routes;
    }

    async start() {        

        // * Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlcencoded
        this.app.use(compression());

        // * Public Folder
        this.app.use(express.static(this.publicPath));

        // * Routes
        this.app.use(this.routes);

        // * SPA
        this.app.get('*', (req, res) => {
            console.log(req.url);

            const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);

            // Forma recomendada por IA:
            // res.sendFile('index.html', { root: 'public' });
        });

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public close() {
        this.serverListener?.close();
    }
}