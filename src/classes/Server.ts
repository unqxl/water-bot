import express, { Express } from 'express';
import Logger from './Logger';

export = class WebServer {
    public app: Express;
    public options: WebServerOptions;
    public logger: Logger;

    constructor(options: WebServerOptions) {
        this.app = express();
        this.options = options;
        this.logger = new Logger();
    }

    start() {
        return this.app.listen(this.options.port, () => {
            return this.logger.log(`Server started at port ${this.options.port}!`, 'Web-Server');
        });
    }
}

interface WebServerOptions {
    port: number
}