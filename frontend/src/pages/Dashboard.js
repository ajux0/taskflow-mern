import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const token = localStorage.getItem('token');

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get('/tasks', {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
}, [token]);

  useEffect(() => {
  fetchTasks();
}, [fetchTasks]);

  // Add task
  const addTask = async () => {
    if (!title) return;

    try {
      await API.post(
        '/tasks',
        { title },
        {
          headers: { Authorization: token }
        }
      );
      setTitle('');
      fetchTasks(); // refresh without reload
    } catch (error) {
      console.error(error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: token }
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    try {
      await API.put(
        `/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: { Authorization: token }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div style={styles.container}>
    <h2 style={styles.heading}>TaskFlow Dashboard</h2>

    {/* Add Task */}
    <div style={styles.inputContainer}>
      <input
        style={styles.input}
        placeholder="Enter a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button style={styles.addBtn} onClick={addTask}>
        Add
      </button>
    </div>

    {/* Task List */}
    <ul style={styles.list}>
      {tasks.map((task) => (
        <li key={task._id} style={styles.taskItem}>
          <span
            onClick={() => toggleComplete(task)}
            style={{
              ...styles.taskText,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'gray' : 'black'
            }}
          >
            {task.title}
          </span>

          <button
            style={styles.deleteBtn}
            onClick={() => deleteTask(task._id)}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  addBtn: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  },
  taskText: {
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Dashboard;