import { useState } from "react";
import API from "../services/api";
import type { Task } from "../pages/TaskList";
import Notiflix from "notiflix";

type Props = {
    onCreate: (task: Task) => void;
};

export default function TaskForm({ onCreate }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Notiflix.Notify.warning("Title is required");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/tasks", {
                title,
                description,
            });

            onCreate(res.data);

            Notiflix.Notify.success("Task created successfully");

            setTitle("");
            setDescription("");
        } catch (error) {
            Notiflix.Notify.failure("Task creation failed");
        }

        setLoading(false);
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: "10px" }}>Create Task</h3>

            <input
                className="input"
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="input"
                placeholder="Task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "100%" }}
            >
                {loading ? "Adding Task..." : "Add Task"}
            </button>
        </div>
    );
}