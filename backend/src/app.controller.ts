import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      status: 'API is working',
      docs: 'http://localhost:3000/api', // или другой ваш маршрут документации
      endpoints: [
        '/projects',
        '/tasks',
        '/teams'
      ]
    };
  }
}