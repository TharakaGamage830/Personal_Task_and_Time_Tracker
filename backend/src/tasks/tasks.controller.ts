import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: any, @Request() req){
        return this.tasksService.create(createTaskDto, req.user.userId);
    }

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.tasksService.findOne(+id, req.user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: any, @Request() req) {
        return this.tasksService.update(+id, updateTaskDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tasksService.remove(+id, req.user.userId);
    }

    @Patch(':id/complete')
    toggleComplete(@Param('id') id: string, @Request() req) {
        return this.tasksService.toggleComplete(+id, req.user.userId);
    }

}
