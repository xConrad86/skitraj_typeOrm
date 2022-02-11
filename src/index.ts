import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import routes from "./routes/routes";
import {User} from "./entity/User";


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use("/", routes);  

    // start express server
    app.listen(3000);

    // insert new users for test
 //   await connection.manager.save(connection.manager.create(User, {
 //       firstName: "Timber",
 //       lastName: "Saw",
 //       age: 27
 //   }));
 //   await connection.manager.save(connection.manager.create(User, {
//        firstName: "Phantom",
 //       lastName: "Assassin",
 //       age: 24
 //   }));
    
    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
