import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, IsNull } from 'typeorm';
import { TimeSession } from 'src/time-tracking/time-session.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(TimeSession)
        private sessionsRepository: Repository<TimeSession>,
    ) { }

    async create(createTaskDto: any, userId: number): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user_id: userId,
        } as Partial<Task>);
        return this.tasksRepository.save(task);
    }

    async findAll(userId: number): Promise<any[]> {
        const tasks = await this.tasksRepository.find({ where: { user_id: userId } });

        // Get running sessions for all tasks
        const taskIds = tasks.map(t => t.id);
        const runningSessions = await this.sessionsRepository.find({
            where: taskIds.map(id => ({ task_id: id, end_time: IsNull() }))
        });

        // Map sessions to tasks
        const sessionMap = new Map(runningSessions.map(s => [s.task_id, s]));

        return tasks.map(task => ({
            ...task,
            timer_running: sessionMap.has(task.id),
            timer_start_time: sessionMap.get(task.id)?.start_time || null,
        }));
    }

    async findOne(id: number, userId: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id, user_id: userId } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async update(id: number, updateTaskDto: any, userId: number): Promise<Task> {
        const task = await this.findOne(id, userId);
        this.tasksRepository.merge(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: number, userId: number): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async toggleComplete(id: number, userId: number): Promise<Task> {
        const task = await this.findOne(id, userId);
        task.is_completed = !task.is_completed;
        task.completed_at = task.is_completed ? new Date() : null;
        return this.tasksRepository.save(task);
    }

}
