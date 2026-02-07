import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async create(createTaskDto: any, userId: number): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user_id: userId,
        } as Partial<Task>);
        return this.tasksRepository.save(task);
    }

    async findAll(userId: number): Promise<Task[]> {
        return this.tasksRepository.find({ where: { user_id: userId } });
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
        return this.tasksRepository.save(task);
    }

}
