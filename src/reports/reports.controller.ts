import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get('deleted-percentage')
  deleted() { return this.svc.percentageDeleted(); }

  @Get('non-deleted-percentage')
  nonDeleted(@Query('withPrice') withPrice = 'true', @Query('start') start?: string, @Query('end') end?: string) {
    return this.svc.percentageNonDeletedWithPrice({ withPrice: withPrice === 'true', start, end });
  }

  @Get('top-categories')
  top() { return this.svc.topCategories(); }
}
