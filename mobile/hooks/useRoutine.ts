import { RoutineCreateType, RoutineReturnType, RoutineUpdateType } from "@/model/routine.model";
import { routineCreateService, routineDeleteService, routineGetService, routineUpdateService } from "@/service/online/routineService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


type useRoutineType = {
    getRoutine: () => RoutineReturnType[];
    postRoutine: (data: RoutineCreateType) => Promise<RoutineReturnType>;
    updateRoutine: (data: RoutineUpdateType, id: string) => Promise<RoutineReturnType>;
    deleteRoutine: (id: string) => Promise<RoutineReturnType>;
};

export default function useRoutine(): useRoutineType {
    const queryClient = useQueryClient();


    const getRoutine = (): RoutineReturnType[] => {
        try {
            const res = useQuery({
                queryKey: ["routines"],
                queryFn: async () => {
                    const response = await routineGetService();
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

    const postRoutine = async (data: RoutineCreateType): Promise<RoutineReturnType> => {
        try {
            const res = await routineCreateService(data);

            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });

            queryClient.invalidateQueries({
                queryKey: ["routines"],
            });

            if (!res) {
                throw new Error("Failed to create routine");
            }

            return res;

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateRoutine = async (data: RoutineUpdateType, id: string): Promise<RoutineReturnType> => {
        try {
            const res = await routineUpdateService(data, id);

            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });

            queryClient.invalidateQueries({
                queryKey: ["routines"],
            });

            if (!res) {
                throw new Error("Failed to create routine");
            }

            return res;

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const deleteRoutine = async (id: string) => {
        try {
            const res = await routineDeleteService(id);

            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });

            queryClient.invalidateQueries({
                queryKey: ["routines"],
            });

            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { getRoutine, postRoutine, updateRoutine, deleteRoutine };
}