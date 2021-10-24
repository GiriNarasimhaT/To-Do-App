import React from "react";
import { ListItem, ListItemText, Button } from "@material-ui/core";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function TodoListItem({ todo, inprogress, id}) {
  const [user, loading, error] = useAuthState(auth);
  const usid = user.uid;
  function toggleInProgress() {
    db.collection("users").doc(String(usid)).collection("todos").doc(id).update({
      inprogress: !inprogress,
    });
  }
 
  function deleteTodo() {
    db.collection("users").doc(String(usid)).collection("todos").doc(id).delete();
  }

  return (
    <div style={{ display: "flex",flexDirection:"column",padding:"10px",backgroundColor:"rgb(230, 230, 230)",borderRadius:"25px",marginTop:"10px"}}>
      <ListItem>
        <ListItemText 
          primary={todo}
          secondary=
          {
            inprogress ? "In Progress..." : "Completed ✅"
          }
        />
      </ListItem>

      <div style={{flexDirection:"row",alignSelf:"flex-end"}}>
      <Button onClick={toggleInProgress}>
        {inprogress ? "✔️" : "❌"}
      </Button>
      <Button onClick={deleteTodo}>🗑️</Button>
      </div>
    </div>
  );
}
