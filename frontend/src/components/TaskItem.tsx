import { useState } from "react";
import type { Task } from "../pages/TaskList";
import API from "../services/api";
import Notiflix from "notiflix";

type Props = {
    task: Task;
    onDelete: (id: number) => void;
    onUpdate: (id: number, status: Task["status"]) => void;
};

export default function TaskItem({ task, onDelete, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");

    const [status, setStatus] = useState<Task["status"]>(task.status);
    const [priority, setPriority] = useState<Task["priority"]>(task.priority || "low");

    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        if (!title.trim()) {
            Notiflix.Notify.warning("Title is required");
            return;
        }

        setLoading(true);

        try {
            await API.put(`/tasks/${task.id}`, {
                title,
                description,
                status,
                priority,
            });

            Notiflix.Notify.success("Task updated successfully");
            setIsEditing(false);
        } catch {
            Notiflix.Notify.failure("Update failed");
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            await API.delete(`/tasks/${task.id}`);
            onDelete(task.id);
            Notiflix.Notify.success("Task deleted successfully");
        } catch {
            Notiflix.Notify.failure("Delete failed");
        }

        setLoading(false);
    };

    const handleStatusChange = (newStatus: Task["status"]) => {
        setStatus(newStatus);
        onUpdate(task.id, newStatus);
    };

    const getStatusClass = () => {
        switch (status) {
            case "completed":
                return "badge badge-completed";
            case "in_progress":
                return "badge badge-progress";
            default:
                return "badge badge-pending";
        }
    };

    const getPriorityClass = () => {
        switch (priority) {
            case "high":
                return "badge badge-high";
            case "medium":
                return "badge badge-medium";
            default:
                return "badge badge-low";
        }
    };

    return (
        <div className="card">

            {isEditing ? (
                <div>

                    <input
                        className="input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        className="input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="selectArea">
                        <div className="selectItem">
                            <label>Status</label>
                            <select
                                className="select"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as Task["status"])
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="selectItem">
                            <label>Priority</label>
                            <select
                                className="select"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as Task["priority"])
                                }
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                    </div>


                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleEdit}
                        disabled={loading}
                        style={{ width: "100%" }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            ) : (
                <>
                    <h3>{title}</h3>
                    <p>{description}</p>

                    <div className="row">
                        <span className={getStatusClass()}>
                            {status}
                        </span>

                        <span className={getPriorityClass()}>
                            {priority}
                        </span>
                    </div>
                </>
            )}

            <div className="row">

                <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit"}
                </button>

                <select
                    className="select"
                    value={status}
                    onChange={(e) =>
                        handleStatusChange(e.target.value as Task["status"])
                    }
                >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    Delete
                </button>

            </div>
        </div>
    );
}