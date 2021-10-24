
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import TodoListItem from "./Todo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout,user } from "./firebase";
import { orderBy } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const history = useHistory();
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = await query.docs[0].data();
      setName(data.name);
      setUserId(data.uid);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
    const usid = user.uid;
    function getTodos() {
      db.collection("users").doc(String(usid)).collection("todos").orderBy("timestamp","desc").onSnapshot((snapshot) =>
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          inprogress: doc.data().inprogress
        })))
      );
    }
    getTodos();
  }, [user, loading]);

  function addTodo(e) {
    e.preventDefault();

    if(todoInput!=""){
      db.collection("users").doc(String(user.uid)).collection("todos").add({
        inprogress: true,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        todo: todoInput,
      });
    }

    setTodoInput("");
  }

  return (
    <div className="dashboard">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%"
        }}
      >
        <div style={{display: "flex",alignSelf:"flex-end",flexDirection:"column", paddingRight:"3%",paddingTop:"3%"}}>
          {/* Logged in as
          <div>{name}</div>
          <div>{user?.email}</div> */}
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
        <h1>TODO</h1>
        <form>
          <TextField
            id="filled-multiline-static"
            label="Write a Todo"
            value={todoInput}
            style={{ width: "90vw", maxWidth: "500px" }}
            onChange={(e) => setTodoInput(e.target.value)}
            multiline
            rows={2}
            defaultValue=""
            variant="filled"
          />
          <br></br><br></br>
          <button className="dashboard__btn_add"
            type="submit"
            variant="contained"
            onClick={addTodo}>
            ADD
          </button>
          <br></br>
        </form>

        <div>
        <br></br><br></br>
        </div>

        <div className="dashboard_list" style={{ width: "90vw", maxWidth: "1000px"}}>
          <h2 style={{textAlign:"center",fontSize:"30px"}}>Your ToDo's</h2>
          {todos.map((todo) => (
            <TodoListItem
              todo={todo.todo}
              inprogress={todo.inprogress}
              id={todo.id}
            />
          ))}
        </div>
        <div>
        <br></br><br></br>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;