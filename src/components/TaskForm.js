import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title) {
      addTask({ title, description, status });
      setTitle("");
      setDescription("");
      setStatus("To Do");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />
      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
      >
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>
      <Button type="submit" variant="text" size="medium" color="primary">
        Add Task
      </Button>
    </form>
  );
};

export default TaskForm;
