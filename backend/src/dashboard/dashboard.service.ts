import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { TimeSession } from 'src/time-tracking/time-session.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(TimeSession)
        private sessionsRepository: Repository<TimeSession>,
    ) { }


    async getStats(userId: number) {

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);

        const tasksCompletedToday = await this.tasksRepository.count({
            where: {
                user_id: userId,
                is_completed: true,
                updated_at: MoreThanOrEqual(startOfToday),
            }
        });

        const tasksCompletedWeek = await this.tasksRepository.count({
            where: {
                user_id: userId,
                is_completed: true,
                updated_at: MoreThanOrEqual(startOfThisWeek),
            }
        });

        const { sum: todaySeconds } = await this.sessionsRepository
            .createQueryBuilder('session')
            .leftJoin('session.task', 'task')
            .select('SUM(session.duration_seconds)', 'sum')
            .where('task.user_id = :userId', { userId })
            .andWhere('session.start_time >= :startOfToday', { startOfToday })
            .getRawOne();

        const { sum: weekSeconds } = await this.sessionsRepository
            .createQueryBuilder('session')
            .leftJoin('session.task', 'task')
            .select('SUM(session.duration_seconds)', 'sum')
            .where('task.user_id = :userId', { userId })
            .andWhere('session.start_time >= :startWeek', { startWeek: startOfThisWeek })
            .getRawOne();



        return {
            tasksCompletedToday,
            tasksCompletedWeek,
            totalHoursToday: ((todaySeconds || 0) / 3600).toFixed(2),
            totalHoursWeek: ((weekSeconds || 0) / 3600).toFixed(2),

        };
    }
}
