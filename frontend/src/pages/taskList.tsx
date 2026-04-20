import { useEffect, useState } from "react";
import API from "../services/api";

type Task = {
    id: number;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
};

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // 📌 Fetch Tasks
    const fetchTasks = async () => {
        const res = await API.get("/tasks");
        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ➕ Create Task (no reload)
    const createTask = async () => {
        if (!title.trim()) return;

        const res = await API.post("/tasks", {
            title,
            description,
        });

        setTasks((prev) => [res.data, ...prev]); // add instantly
        setTitle("");
        setDescription("");
    };

    // 🔄 Update Status (no reload)
    const updateStatus = async (id: number, status: Task["status"]) => {
        await API.put(`/tasks/${id}`, { status });

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, status } : task
            )
        );
    };

    // ❌ Delete Task (no reload)
    const deleteTask = async (id: number) => {
        await API.delete(`/tasks/${id}`);

        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Task Manager</h2>

            {/* CREATE TASK */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />

                <input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />

                <button onClick={createTask}>Add Task</button>
            </div>

            {/* TASK LIST */}
            {tasks.map((task) => (
                <div
                    key={task.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                    }}
                >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <p>
                        Status: <strong>{task.status}</strong>
                    </p>

                    {/* STATUS UPDATE */}
                    <select
                        value={task.status}
                        onChange={(e) =>
                            updateStatus(task.id, e.target.value as Task["status"])
                        }
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* DELETE */}
                    <button
                        onClick={() => deleteTask(task.id)}
                        style={{ marginLeft: "10px", color: "red" }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}