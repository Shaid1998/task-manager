import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm.tsx";
import TaskItem from "../components/TaskItem.tsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export type Task = {
    id: number;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    priority?: "low" | "medium" | "high";
};

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<"all" | Task["status"]>("all");
    const [priorityFilter, setPriorityFilter] =
        useState<"all" | Task["priority"]>("all");

    const fetchTasks = async () => {
        setLoading(true);

        try {
            const res = await API.get("/tasks");

            const safeData: Task[] = res.data.map((task: Task) => ({
                ...task,
                status: task.status ?? "pending",
                priority: task.priority ?? "low",
            }));

            setTasks(safeData);
        } catch (error) {
            console.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = (newTask: Task) => {
        const safeTask: Task = {
            ...newTask,
            status: newTask.status ?? "pending",
            priority: newTask.priority ?? "low",
        };

        setTasks((prev) => [safeTask, ...prev]);
    };

    const updateStatus = async (id: number, status: Task["status"]) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, status } : task
            )
        );

        try {
            await API.put(`/tasks/${id}`, { status });
        } catch {
            fetchTasks();
        }
    };

    const deleteTask = async (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));

        try {
            await API.delete(`/tasks/${id}`);
        } catch {
            fetchTasks();
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchSearch = task.title
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchStatus =
                statusFilter === "all"
                    ? true
                    : task.status === statusFilter;

            const matchPriority =
                priorityFilter === "all"
                    ? true
                    : task.priority === priorityFilter;

            return matchSearch && matchStatus && matchPriority;
        });
    }, [tasks, search, statusFilter, priorityFilter]);

    const stats = useMemo(() => {
        return {
            total: tasks.length,
            pending: tasks.filter((t) => t.status === "pending").length,
            progress: tasks.filter((t) => t.status === "in_progress").length,
            completed: tasks.filter((t) => t.status === "completed").length,
        };
    }, [tasks]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(tasks);

        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setTasks(items);
    };

    const visibleTasks = filteredTasks;

    return (
        <div className="container">

            <h2 className="title">Task Management</h2>

            <div className="stats-grid">
                <div className="stat-card">Total<br />{stats.total}</div>
                <div className="stat-card">Pending<br />{stats.pending}</div>
                <div className="stat-card">Progress<br />{stats.progress}</div>
                <div className="stat-card">Done<br />{stats.completed}</div>
            </div>

            <TaskForm onCreate={addTask} />

            <div className="controls">

                <input
                    className="input searchInp"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as any)
                    }
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    className="select"
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value as any)
                    }
                >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {loading && (
                <div className="loading">Loading tasks...</div>
            )}

            {!loading && visibleTasks.length === 0 && (
                <div className="empty">
                    No tasks found 🚀 Try creating one
                </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {!loading &&
                                visibleTasks.map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={String(task.id)}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TaskItem
                                                    task={task}
                                                    onDelete={deleteTask}
                                                    onUpdate={updateStatus}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

        </div>
    );
}