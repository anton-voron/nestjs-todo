import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './DTO/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilter } from './DTO/get-task-filter';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger(TaskRepository.name);
  public async createTask(taskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = taskDTO;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
      delete task.user;
      return task;
    } catch (err) {
      this.logger.error(
        `Failed to create task for ${user.username}. Data: ${JSON.stringify(
          taskDTO,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  public async getTasks(filterDto: GetTaskFilter, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for ${user.username}. Filters: ${
          (JSON.stringify(filterDto), err.stack)
        }`,
      );
      throw new InternalServerErrorException();
    }
  }
}
