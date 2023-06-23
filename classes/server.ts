
import express from 'express';


export default class Server {
    public app: express.Application;
    public port: number = 3000;

    

    constructor() {
        this.app = express();
    }


    start(callback: Function) {
        this.app.listen(process.env.PORT || 3000, callback());
        // this.app.listen( this.port, callback() );
    }




}