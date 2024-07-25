// src/registration/registration.controller.ts

import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { RegistrationService } from '../services/registration.service';
import { IRegistration } from '../model/collections/registration';

@Controller('registration')
export class RegistrationController {

  @Post('/add')
  async addRegistration(@Body() registration: IRegistration) {
    try {
      const result = await RegistrationService.Instance.addRegistration(registration);
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/get')
  async getAllRegistrations() {
    try {
      const registrations = RegistrationService.Instance.getAllRegistrations();
      return {  data: registrations };
    } catch (error) {
      throw new HttpException('Error retrieving registrations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/getByType')
  async getRegistrationsByType(@Query('registration_type') registration_type: string) {
    try {
      const registrations = await RegistrationService.Instance.getRegistrationsByType(registration_type);
      return { data: registrations };
    } catch (error) {
      throw new HttpException('Error retrieving registrations by type', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update/profile/:id')
  async updateProfile(@Param('id') id: string, @Body() registration: IRegistration) {
    try {
      const updatedUser = await RegistrationService.Instance.updateProfile(id, registration);
      return { data: updatedUser };
    } catch (error) {
      throw new HttpException('Error updating user profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/update/user/password/:id')
  async updatePassword(@Param('id') id: string, @Body() updatePassword: { current_password: string, password: string, confirm_password: string }) {
    try {
      const updatedUser = await RegistrationService.Instance.updatePassword(id, updatePassword);
      return { data: updatedUser };
    } catch (error) {
      throw new HttpException('Error updating user password', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/verify/user/sendEmail')
  async sendEmail(@Body() body: any) {
    try {
      const { name, email, senderName, senderEmail } = body;
      if (!email || !name || !senderName || !senderEmail) {
        throw new HttpException('Name, email, senderName, and senderEmail are required', HttpStatus.BAD_REQUEST);
      }

      return await RegistrationService.Instance.verifyUser(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/verify/email')
  async verifyEmail(@Body() body: any) {
    try {
      const { email, password } = body;
      if (!email || !password) {
        throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
      }

      return await RegistrationService.Instance.verifyEmail(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
