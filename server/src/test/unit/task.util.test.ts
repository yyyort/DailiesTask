import { describe, it, expect } from "vitest";
import { taskConvertFromDb, tasksConvertFromDb } from "../../util/task.util";
import { TaskTableReturnType } from "../../db/schema";
import { TaskReturnType } from "../../model/task.model";

describe("task utils test", () => {
    it("should convert a task from db format to model format", async () => {
        const taskFromDb: TaskTableReturnType = {
            id: 1,
            title: "Test Task",
            description: "Test Description",
            status: "todo",
            timeToDo: new Date("2023-10-01"),
            deadline: new Date("2023-10-10")
        };

        const expectedTask: TaskReturnType = {
            id: 1,
            title: "Test Task",
            description: "Test Description",
            status: "todo",
            timeToDo: "Sun Oct 01 2023",
            deadline: "Tue Oct 10 2023"
        };

        const result = await taskConvertFromDb(taskFromDb);
        expect(result).toEqual(expectedTask);
    });

    it("should handle null description and timeToDo", async () => {
        const taskFromDb: TaskTableReturnType = {
            id: 2,
            title: "Test Task 2",
            description: null,
            status: "todo",
            timeToDo: null,
            deadline: new Date("2023-11-10")
        };

        const expectedTask: TaskReturnType = {
            id: 2,
            title: "Test Task 2",
            description: "",
            status: "todo",
            timeToDo: "",
            deadline: "Fri Nov 10 2023"
        };

        const result = await taskConvertFromDb(taskFromDb);
        expect(result).toEqual(expectedTask);
    });


    describe("array of tasks test", () => {
        it("should convert an array of tasks from db format to model format", async () => {
            const tasksFromDb: TaskTableReturnType[] = [
                {
                    id: 1,
                    title: "Test Task 1",
                    description: "Test Description 1",
                    status: "todo",
                    timeToDo: new Date("2023-10-01"),
                    deadline: new Date("2023-10-10")
                },
                {
                    id: 2,
                    title: "Test Task 2",
                    description: null,
                    status: "overdue",
                    timeToDo: null,
                    deadline: new Date("2023-11-10")
                }
            ];

            const expectedTasks: TaskReturnType[] = [
                {
                    id: 1,
                    title: "Test Task 1",
                    description: "Test Description 1",
                    status: "todo",
                    timeToDo: "Sun Oct 01 2023",
                    deadline: "Tue Oct 10 2023"
                },
                {
                    id: 2,
                    title: "Test Task 2",
                    description: "",
                    status: "overdue",
                    timeToDo: "",
                    deadline: "Fri Nov 10 2023"
                }
            ];

            const result = await tasksConvertFromDb(tasksFromDb);
            expect(result).toEqual(expectedTasks);
        });
    });
});
