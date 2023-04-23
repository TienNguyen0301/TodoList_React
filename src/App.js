import "./App.css";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faSpinner,
    faCircleCheck,
    faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";

function App() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [todos, setTodos] = useState([]);
    const [completed, setCompleted] = useState(todos.completed);
    const [loading, setLoading] = useState([]);

    const todoCount = todos.length;
    const completedTasks = todos.filter((todo) => todo.completed).length;
    const sortedTodos = [...todos].sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axios.get(
                    `https://jsonplaceholder.typicode.com/users`
                );
                setUsers(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, []);

    useEffect(() => {
        const getTasks = async () => {
            if (userId) {
                try {
                    const res = await axios.get(
                        `https://jsonplaceholder.typicode.com/users/${userId}/todos`
                    );
                    setTodos(res.data);
                    console.log(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getTasks();
    }, [userId]);

    const handleUserSelect = (event) => {
        const selectedUserId = event.target.value;
        setUserId(selectedUserId);
    };

    function handleMarkDone(taskId) {
        setLoading((prevLoading) => ({ ...prevLoading, [taskId]: true }));
        fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify({ completed: true }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log("Task marked as done:", json);
                setCompleted(true);
            })
            .then(() => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === taskId ? { ...todo, completed: true } : todo
                    )
                );
            })
            .finally(() => {
                setLoading((prevLoading) => ({
                    ...prevLoading,
                    [taskId]: false,
                }));
            })
            .catch((error) => console.error(error));
    }

    return (
        <>
            <Header />
            <div className="App">
                <div className="title">
                    <h4>User</h4>
                </div>
                <select
                    defaultValue={"DEFAULT"}
                    onChange={handleUserSelect}
                    className="form-select"
                    required
                >
                    <option value="DEFAULT" disabled>
                        Select User
                    </option>
                    {users.map((user) => (
                        <>
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        </>
                    ))}
                </select>
                <div className="title">
                    <h4>Task</h4>
                </div>
                <div className="space-data">
                    {userId && (
                        <div className="main-list">
                            <ul className="list-items">
                                {sortedTodos.map((todo) => (
                                    <div className="main">
                                        <div className="item">
                                            {todo.completed ? (
                                                <div className="status-task">
                                                    <FontAwesomeIcon
                                                        className="icon-done"
                                                        icon={faCircleCheck}
                                                    />{" "}
                                                    <li
                                                        key={todo.id}
                                                        className="item"
                                                    >
                                                        {todo.title}
                                                    </li>{" "}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="status-task">
                                                        <FontAwesomeIcon
                                                            className="icon-fault"
                                                            icon={faSquareMinus}
                                                        />{" "}
                                                        <li
                                                            key={todo.id}
                                                            className="item"
                                                        >
                                                            {todo.title}
                                                        </li>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleMarkDone(
                                                                todo.id
                                                            )
                                                        }
                                                        type="button"
                                                        className="mark-done btn btn-primary"
                                                    >
                                                        {loading[todo.id] ? (
                                                            <FontAwesomeIcon
                                                                icon={faSpinner}
                                                                spin={
                                                                    loading[
                                                                        todo.id
                                                                    ]
                                                                }
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                        Mark Done
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <p>
                    Done {completedTasks}/{todoCount} tasks
                </p>
            </div>
            <Footer />
        </>
    );
}

export default App;
