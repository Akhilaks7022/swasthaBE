import * as mongoose from "mongoose";

//#region start-db-import
//Registration
import * as Registration from "../src/registration/model/collections/registration";

export class DBModels {
   //#region start-db-model-declaration

   //Registration
   public Registration: mongoose.Model<Registration.IRegistration>;


   //#endregion start-db-model-declaration
   constructor(dbC: mongoose.Connection) {


      //Registration
      this.Registration = dbC.model<Registration.IRegistration>(
         Registration.CollectionName,
         Registration.RegistrationSchema,
         Registration.CollectionName
      );
   }
}
