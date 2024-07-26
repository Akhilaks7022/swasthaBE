import * as mongoose from "mongoose";

//#region start-db-import
//Registration
import * as Registration from "../src/registration/model/collections/registration";

//Contact
import * as Contact from "../src/contact/model/collections/contact";

export class DBModels {
   //#region start-db-model-declaration

   //Registration
   public Registration: mongoose.Model<Registration.IRegistration>;

   //Contact
   public Contact: mongoose.Model<Contact.IContact>;


   //#endregion start-db-model-declaration
   constructor(dbC: mongoose.Connection) {


      //Registration
      this.Registration = dbC.model<Registration.IRegistration>(
         Registration.CollectionName,
         Registration.RegistrationSchema,
         Registration.CollectionName
      );

      //Contact
      this.Contact = dbC.model<Contact.IContact>(
         Contact.CollectionName,
         Contact.ContactSchema,
         Contact.CollectionName
      );
   }
}