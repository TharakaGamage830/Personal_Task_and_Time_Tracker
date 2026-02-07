import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {

    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    getStats(@Request() req) {
        return this.dashboardService.getStats(req.user.userId);
    }
}
