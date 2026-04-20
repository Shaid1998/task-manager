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
    const fetchTasks = () => {
        API.get("/tasks").then((res) => {
            setTasks(res.data);
        });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ➕ Create Task
    const createTask = () => {
        if (!title) return;

        API.post("/tasks", {
            title,
            description,
        }).then(() => {
            setTitle("");
            setDescription("");
            fetchTasks();
        });
    };

    // 🔄 Update Status
    const updateStatus = (id: number, status: string) => {
        API.put(`/tasks/${id}`, {
            status,
        }).then(() => {
            fetchTasks();
        });
    };

    // ❌ Delete Task
    const deleteTask = (id: number) => {
        API.delete(`/tasks/${id}`).then(() => {
            fetchTasks();
        });
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
                    <p>Status: {task.status}</p>

                    {/* STATUS UPDATE */}
                    <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
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