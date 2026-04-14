import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [showWidget, setShowWidget] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  function addTask() {
    const trimText = text.trim();
    if (trimText === "") return;

    const taskCategory = category === "" ? "Other" : category;

    const now = new Date();

    const newTask = {
      id: Date.now(),
      text: trimText,
      category: taskCategory,
      date: now.toLocaleDateString(),
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setText("");
    setCategory("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  function toggleTaskComplete(id) {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function editTask(id, currentText) {
    setEditId(id);
    setEditText(currentText);
  }

  function saveEdit(id) {
    if (editText.trim() === "") return;

    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, text: editText }
          : task
      )
    );

    setEditId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditId(null);
    setEditText("");
  }

  function clearAll() {
    setTasks([]);
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => a.completed - b.completed
  );

  const remainingAllTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalTasks = tasks.length;
  const categoriesUsed = [...new Set(tasks.map(task => task.category))].length;

  const today = new Date().toLocaleDateString();

  return (
    <div className="container">
      {page === "home" ? (
        <div className="home-page">
          <div className="home-card">
            <h1>Task Manager</h1>
            <p className="home-text">
              Organize, Track and Manage daily tasks efficiently.
            </p>

            <div className="dashboard">
              <div className="dashboard-card">
                <i className="fa-solid fa-list"></i>
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
              </div>

              <div className="dashboard-card">
                <i className="fa-solid fa-check"></i>
                <h3>Completed</h3>
                <p>{completedTasks}</p>
              </div>

              <div className="dashboard-card">
                <i className="fa-solid fa-hourglass-half"></i>
                <h3>Pending</h3>
                <p>{pendingTasks}</p>
              </div>

              <div className="dashboard-card">
                <i className="fa-solid fa-layer-group"></i>
                <h3>Categories</h3>
                <p>{categoriesUsed}</p>
              </div>
            </div>

            <button
              className="home-btn"
              onClick={() => setPage("task")}
            >
              Go To Tasks
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="navbar">
            <div className="nav-left">
            <i className="fa-solid fa-house home-icon" onClick={() => setPage("home")}></i>
            <h2>Task Manager</h2>
          </div>
            <button className="nav-clear" onClick={clearAll}>
              Clear All
            </button>
          </div>

          <div className="main-layout">
            <div className="left-panel">
              <h3>Manage Tasks</h3>

              <div className="add-section">
                <h2>Add Task</h2>

                <input
                  type="text"
                  placeholder="Enter task..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>

                <button className="add-btn" onClick={addTask}>
                  Add Task
                </button>
              </div>

              <div className="search-section">
                <h2>Search / Filter</h2>

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="right-panel">
              {sortedTasks.map(task => (
                <div
                  key={task.id}
                  className={`task-card ${task.category.toLowerCase()}`}
                >
                  <div>
                    {editId === task.id ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                        }}
                      />
                    ) : (
                      <h3 className={task.completed ? "completed" : ""}>
                        {task.text}
                      </h3>
                    )}

                    <p>Category: {task.category}</p>
                    <small>{task.date}</small>
                  </div>

                  <div className="task-card-buttons">
                    {editId === task.id ? (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() => saveEdit(task.id)}
                        >
                          Save
                        </button>

                        <button
                          className="delete-btn"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() => toggleTaskComplete(task.id)}
                        >
                          {task.completed ? "Undo" : "Done"}
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => editTask(task.id, task.text)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {sortedTasks.length === 0 && <p>No tasks found</p>}
            </div>
          </div>

          <div className="today-widget">
            <div
              className="today-box"
              onClick={() => setShowWidget(!showWidget)}
            >
              <p>📅 Today</p>
              <h4>{today}</h4>
            </div>

            {showWidget && (
              <div className="today-dropdown">
                <h4>Remaining Tasks</h4>

                {remainingAllTasks.length === 0 ? (
                  <p>No pending tasks</p>
                ) : (
                  remainingAllTasks.map(task => (
                    <p key={task.id}>• {task.text}</p>
                  ))
                )}
              </div>
            )}
          </div>

          <footer className="footer">
            <p>Task Manager | Organize your daily tasks efficiently</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;