import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { TimeSession } from 'src/time-tracking/time-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task, TimeSession])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
