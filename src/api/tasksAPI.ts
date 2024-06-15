import { get, push, ref, remove, update } from 'firebase/database';
import { database } from '../firebase/firebase.config';
import { BasicTaskData, TaskData } from '../types/type';

export const getTasks = async (uid: string) => {
  try {
    if (uid) {
      let tasks: TaskData[] = [];
      const snapshot = await get(ref(database, 'tasks/' + uid));
      if (snapshot.exists()) {
        const ids: string[] = Object.keys(snapshot.val());
        const items: TaskData[] = Object.values(snapshot.val());
        if (items.length > 0) {
          items.forEach((item: TaskData, index) => {
            item.id = ids[index];
          });
        }
        tasks = items;
      } else {
        tasks = [];
      }
      return tasks;
    } else {
      throw new Error('User Id is not available!');
    }
  } catch (error) {
    console.error(error);
  }
};

export const addTask = async (uid: string, task: BasicTaskData) => {
  try {
    await push(ref(database, 'tasks/' + uid), {
      title: task.title,
      description: task.description,
      label: task.label,
      completed: task.completed,
      time: task.time,
      isImportant: task.isImportant,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteTask = async (uid: string, taskId: string) => {
  try {
    const todoRef = ref(database, 'tasks/' + uid + '/' + taskId);
    await remove(todoRef);
  } catch (error) {
    console.error(error);
  }
};

export const updateTask = async (uid: string, taskId: string, task: object) => {
  try {
    const todoRef = ref(database, 'tasks/' + uid + '/' + taskId);
    await update(todoRef, task);
  } catch (error) {
    console.error(error);
  }
};
