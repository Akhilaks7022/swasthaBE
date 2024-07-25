import { DbContext } from "../../../database/DBContext";
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from "axios";
import { IRegistration } from "../model/collections/registration";
import { EmailTemplateService } from "./templates/emailTemplate";
const SibApiV3Sdk = require("sib-api-v3-sdk");

export class RegistrationService {
  private static _instance: RegistrationService;
  static get Instance() {
    if (!this._instance) {
      this._instance = new RegistrationService();
    }
    return this._instance;
  }

  async addRegistration(registration: IRegistration) {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const existingRegistration = await dbContext.Registration.findOne({ email: registration.email });
      if (existingRegistration) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      // Generate OTP
      let otp = Math.floor(100000 + Math.random() * 900000);

      const newRegistration = new dbContext.Registration();
      Object.assign(newRegistration, registration);
      newRegistration.password = otp.toString();
      const result = await newRegistration.save();
      const defaultClient = SibApiV3Sdk.ApiClient.instance;

      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.email_apiKey;

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = {
        to: [
          {
            name: registration.name,
            email: registration.email,
          },
        ],
        subject: EmailTemplateService.Email_Subject,
        htmlContent: EmailTemplateService.Email_Content(otp),
        sender: {
          name: "Swastha Technovations",
          email: "info@atmaparikshan.com",
        },
        headers: {
          "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        },
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      return { success: true, message: "Registration added successfully", data: result };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error adding registration', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllRegistrations(): Promise<IRegistration[]> {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const savedRegistrations = await dbContext.Registration.find({});
      if (savedRegistrations.length === 0) {
        throw new HttpException('No registrations found', HttpStatus.NOT_FOUND);
      }
      return savedRegistrations;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error retrieving registrations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRegistrationsByType(registration_type: string): Promise<IRegistration[]> {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const savedRegistrations = await dbContext.Registration.find({ registration_type });
      if (savedRegistrations.length === 0) {
        throw new HttpException('No registrations found for the given type', HttpStatus.NOT_FOUND);
      }
      return savedRegistrations;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error retrieving registrations by type', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmail(body: any) {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const user = await dbContext.Registration.findOne({ email: body.email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (body.password !== user.password) {
        throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
      }

      return {
        name: user.name,
        email: user.email,
        mobile: user.mobile_number,
        _id: user._id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error verifying email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyUser(body: any) {
    try {
      const receiverName = 'Swastha Technovations';
      const receiverEmail = 'info@atmaparikshan.com';
      const defaultClient = SibApiV3Sdk.ApiClient.instance;

      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.email_apiKey;

      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

      const sendSmtpEmail = {
        to: [
          {
            name: receiverName,
            email: receiverEmail,
          },
        ],
        subject: EmailTemplateService.Another_Email_Subject,
        htmlContent: EmailTemplateService.Another_Email_Content(),
        sender: {
          name: body.senderName,
          email: body.senderEmail,
        },
        headers: {
          'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error sending email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfile(id: string, registration: IRegistration): Promise<IRegistration> {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const updatedUser = await dbContext.Registration.findOne({ id });
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(updatedUser, registration); // Update existing user instead of creating a new instance
      const result = await updatedUser.save();
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error updating user profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePassword(id: string, { current_password, password, confirm_password }: { current_password: string, password: string, confirm_password: string }): Promise<IRegistration> {
    try {
      const dbContext = await DbContext.getContextByConfig();
      const user = await dbContext.Registration.findById(id).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (current_password !== user.password) {
        throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
      }

      if (password === current_password) {
        throw new HttpException('New password must be different from current password', HttpStatus.BAD_REQUEST);
      }

      if (password !== confirm_password) {
        throw new HttpException('Password and confirm password do not match', HttpStatus.BAD_REQUEST);
      }

      user.password = password;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Unexpected error:", error);
      throw new HttpException('Error updating user password', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
