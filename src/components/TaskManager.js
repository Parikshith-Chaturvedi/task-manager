import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import { Button, Container } from "@mui/material";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    const docRef = await addDoc(collection(db, "tasks"), task);
    setTasks([...tasks, { id: docRef.id, ...task }]);
    setOpen(false);
  };

  const handleEditTask = async (task) => {
    const taskDoc = doc(db, "tasks", taskToEdit.id);
    await updateDoc(taskDoc, task);
    setTasks(
      tasks.map((t) =>
        t.id === taskToEdit.id ? { ...taskToEdit, ...task } : t
      )
    );
    setTaskToEdit(null);
    setOpen(false);
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSubmit = (task) => {
    if (taskToEdit) {
      handleEditTask(task);
    } else {
      handleAddTask(task);
    }
  };

  const handleOpen = () => {
    setTaskToEdit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setOpen(true);
  };

  return (
    <Container>
      <Button variant="contained" onClick={handleOpen}>
        Add Task
      </Button>
      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDeleteTask}
      />
      <TaskForm
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        taskToEdit={taskToEdit}
      />
    </Container>
  );
};

export default TaskManager;
