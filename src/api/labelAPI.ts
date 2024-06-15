import { get, push, ref, remove, update } from 'firebase/database';
import { TaskType } from '../types/type';
import { database } from '../firebase/firebase.config';

export const getLabels = async (uid: string) => {
  try {
    if (uid) {
      let labels: TaskType[] | [] = [];
      const snapshot = await get(ref(database, 'labels/' + uid));
      if (snapshot.exists()) {
        const ids: string[] = Object.keys(snapshot.val());
        const items: TaskType[] = Object.values(snapshot.val());
        if (items.length > 0) {
          items.forEach((item, index) => {
            item.id = ids[index];
          });
        }
        labels = items;
      } else {
        labels = [];
      }
      return labels;
    } else {
      throw new Error('User Id is not available!');
    }
  } catch (error) {
    console.error(error);
  }
};

export const addLabel = async (uid: string, label: string) => {
  try {
    await push(ref(database, 'labels/' + uid), {
      label,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteLabel = async (uid: string, labelId: string) => {
  try {
    const labelRef = ref(database, 'labels/' + uid + '/' + labelId);
    await remove(labelRef);
  } catch (error) {
    console.error(error);
  }
};

export const updateLabel = async (
  uid: string,
  labelId: string,
  label: string
) => {
  try {
    const labelRef = ref(database, 'labels/' + uid + '/' + labelId);
    await update(labelRef, { label });
  } catch (error) {
    console.error(error);
  }
};
