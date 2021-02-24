import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './DTO/create-task-dto';
import { GetTaskFilter } from './DTO/get-task-filter';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  public getTasks(filterDto: GetTaskFilter, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  public async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return found;
  }
  public async createTask(taskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(taskDto, user);
  }

  public async deleteTask(id: number, user: User): Promise<DeleteResult> {
    const deleted = await this.taskRepository.delete({ id, userId: user.id });
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return deleted;
  }

  public async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);
    found.status = status;
    await found.save();
    return found;
  }
}
