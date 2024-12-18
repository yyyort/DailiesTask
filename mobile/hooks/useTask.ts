import {
  TaskCreateType,
  TaskReturnType,
  TaskStatusType,
  TaskTodayReturnType,
  TaskUpdateType,
} from "@/model/task.model";
import {
  taskCreateService,
  taskDeleteService,
  taskTodayGetService,
  taskUpdateService,
  taskUpdateStatusService,
} from "@/service/online/taskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

type useTaskType = {
  getTask: () => TaskTodayReturnType[];
  postTask: (data: TaskCreateType) => Promise<TaskReturnType>;
  updateStutus: (id: number, status: TaskStatusType) => Promise<TaskReturnType>;
  updatedTask: (id: number, task: TaskUpdateType) => Promise<TaskReturnType>;
  deleteTask: (id: number) => Promise<TaskReturnType>;
};

export default function useTasks(): useTaskType {
  const queryClient = useQueryClient();

  const getTask = (): TaskTodayReturnType[] => {
    try {
      const res = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
          const response = await taskTodayGetService();
          return response;
        },
      });

      if (res.error) {
        throw res.error;
      }

      if (!res.data) {
        return [];
      }

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const postTask = async (data: TaskCreateType): Promise<TaskReturnType> => {
    try {
      const res = await taskCreateService(data);

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateStutus = async (id: number, status: TaskStatusType): Promise<TaskReturnType> => {
    try {
      const res = await taskUpdateStatusService(id, status);

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      if (!res) {
        throw new Error("Task not found");
      }

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updatedTask = async (id: number, task: TaskUpdateType) => {
    try {
      const res = await taskUpdateService(id, task);

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  const deleteTask = async (id: number) => {
    try {
      const res = await taskDeleteService(id);

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getTask,
    postTask,
    updateStutus,
    updatedTask,
    deleteTask,
  };
}
