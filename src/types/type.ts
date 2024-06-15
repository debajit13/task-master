export interface BasicTaskData {
  title: string;
  description: string;
  completed: boolean;
  label: string;
  time: string;
  isImportant: boolean;
}

export interface TaskData extends BasicTaskData {
  id: string;
}

export interface TaskType {
  id: string;
  label: string;
}
