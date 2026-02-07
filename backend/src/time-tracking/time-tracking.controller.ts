import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TimeTrackingService } from './time-tracking.service';

@UseGuards(AuthGuard('jwt'))
@Controller('time-tracking')
export class TimeTrackingController {

    constructor(private readonly timeTrackingService: TimeTrackingService) { }

    @Post(':id/timer/start')
    start(@Param('id') id: string, @Request() req) {
        return this.timeTrackingService.startTimer(+id, req.user.userId);
    }

    @Post(':id/timer/stop')
    stop(@Param('id') id: string, @Request() req) {
        return this.timeTrackingService.stopTimer(+id, req.user.userId);
    }

    @Get(':id/sessions')
    getSessions(@Param('id') id: string, @Request() req) {
        return this.timeTrackingService.getSessions(+id, req.user.userId);
    }


}
