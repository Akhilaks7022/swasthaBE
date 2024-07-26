import { DbContext } from "../../../database/DBContext";
import { HttpException, HttpStatus } from '@nestjs/common';
import { IContact } from "../model/collections/contact";
const SibApiV3Sdk = require("sib-api-v3-sdk");

export class ContactService {
    private static _instance: ContactService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new ContactService();
        }
        return this._instance;
    }

    async newContact(contact: IContact) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const newContact = new dbContext.Contact();
            Object.assign(newContact, contact);
            const result = await newContact.save();
            const defaultClient = SibApiV3Sdk.ApiClient.instance;

            const apiKey = defaultClient.authentications["api-key"];
            apiKey.apiKey = process.env.email_apiKey;

            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpEmail = {
                to: [{ email: "info@atmaparikshan.com" }],
                subject: "Contact Form Submission",
                htmlContent: `
                  <p><strong>Name:</strong> ${contact.name}</p>
                  <p><strong>Email:</strong> ${contact.email}</p>
                  <p><strong>Products:</strong> ${contact.products.join(", ")}</p>
                  <p><strong>Message:</strong> ${contact.message}</p>
              `,
                sender: { name: contact.name, email: contact.email }
            };

            // Send transactional email
            const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
            return result;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error("Unexpected error:", error);
            throw new HttpException('Error adding contact', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
