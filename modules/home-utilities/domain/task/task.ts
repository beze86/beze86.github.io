import { ObjectId } from 'mongodb';

import { UserId } from '../../../users/domain/user';

type TaskId = ObjectId;

type GetWeeklyTasks = {
  userId: UserId;
};

type DeleteWeeklyTask = {
  userId: UserId;
  id: TaskId;
};

type CreateWeeklyTask = {
  userId: UserId;
  weeklyTask: { start: number; end: number; users: { name: string; area: string }[] };
};

type UserTask = {
  name: string;
  area: string;
};

type TaskResult = {
  _id: TaskId;
  userId: UserId;
  start: Date;
  end: Date;
  users: UserTask[];
};

interface TaskRepository {
  getWeeklyTasks: (data: GetWeeklyTasks) => Promise<TaskResult[]>;
  deleteWeeklyTask: (data: DeleteWeeklyTask) => Promise<void>;
  createWeeklyTask: (data: CreateWeeklyTask) => Promise<void>;
}

export type { TaskId, GetWeeklyTasks, DeleteWeeklyTask, CreateWeeklyTask, TaskRepository, TaskResult };
