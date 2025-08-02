import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly svc: SyncService) {}

  // public
  @Post('trigger')
  trigger() { return this.svc.trigger(); }
}
