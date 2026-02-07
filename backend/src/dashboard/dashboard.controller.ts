import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {

    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    getStats(@Request() req) {
        return this.dashboardService.getStats(req.user.userId);
    }
}
