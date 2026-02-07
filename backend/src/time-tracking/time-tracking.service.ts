import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { IsNull, Repository } from 'typeorm';
import { TimeSession } from './time-session.entity';

@Injectable()
export class TimeTrackingService {

    constructor(
        @InjectRepository(TimeSession)
        private sessionsRepository: Repository<TimeSession>,
        private tasksService: TasksService,
    ) { }

    async startTimer(taskId: number, userId: number): Promise<TimeSession> {
        const task = await this.tasksService.findOne(taskId, userId);
        const runningSession = await this.sessionsRepository.findOne({
            where: { task_id: taskId, end_time: IsNull() },
        });

        if (runningSession) {
            throw new BadRequestException('Timer already running for this task');
        }
         const session = this.sessionsRepository.create({
            task_id: taskId,
            start_time: new Date(),
        });
        return this.sessionsRepository.save(session);

    }

    async stopTimer(taskId: number, userId: number): Promise<TimeSession> {
        const task = await this.tasksService.findOne(taskId, userId);

        const runningSession = await this.sessionsRepository.findOne({
            where: { task_id: taskId, end_time: IsNull() },
        });

        if (!runningSession) {
            throw new BadRequestException('No running timer for this task');
        }

        runningSession.end_time = new Date();
        const durationMs = runningSession.end_time.getTime() - runningSession.start_time.getTime();
        runningSession.duration_seconds = Math.floor(durationMs / 1000);

        await this.sessionsRepository.save(runningSession);

        task.total_time_seconds += runningSession.duration_seconds;
        await this.tasksService.update(taskId, { total_time_seconds: task.total_time_seconds }, userId);

        return runningSession;
    }

    async getSessions(taskId: number, userId: number): Promise<TimeSession[]> {
        await this.tasksService.findOne(taskId, userId);
        return this.sessionsRepository.find({ where: { task_id: taskId }, order: { start_time: 'DESC' } });
    }

}
