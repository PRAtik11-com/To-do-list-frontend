import React, { useState, useEffect } from "react";
import axios from "axios";

function Curd() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  // Fetch tasks
  useEffect(() => {
    axios.get("http://localhost:8080/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a task
  const addTask = () => {
    if (newTask.trim() === "") return;
    axios.post("http://localhost:8080/tasks", { text: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Edit a task (set edit mode)
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
  };

  // Update a task
  const updateTask = () => {
    if (editTaskText.trim() === "") return;
    axios.put(`http://localhost:8080/tasks/${editTaskId}`, { text: editTaskText })
      .then(() => {
        setTasks(tasks.map(task => 
          task.id === editTaskId ? { ...task, text: editTaskText } : task
        ));
        setEditTaskId(null);
        setEditTaskText("");
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>To-Do List</h2>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                />
                <button onClick={updateTask}>Save</button>
                <button onClick={() => setEditTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {task.text}
                <button onClick={() => startEdit(task)}> Edit</button>
                <button onClick={() => deleteTask(task.id)}> Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Curd;
