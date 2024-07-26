// src/registration/registration.controller.ts

import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { IContact } from '../model/collections/contact';
import { ContactService } from '../services/contact.service';

@Controller('contact')
export class ContactController {

  @Post('/add')
  async newContact(@Body() contact: IContact) {
    try {
      const result = await ContactService.Instance.newContact(contact);
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
