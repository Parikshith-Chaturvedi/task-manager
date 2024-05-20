import React, { useState, useEffect } from "react";
import { Container, Grid, CircularProgress, Button, TextField } from "@mui/material";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import CustomToolbar from "../components/Toolbar";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import TaskFilter from "../components/TaskFilter";
import ConfirmDialog from "../components/ConfirmDialog";

const TaskPage = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("title")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task) => {
    try {
      await addDoc(collection(db, "tasks"), { ...task, userId: user.uid });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, updatedTask);
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
    setConfirmDialogOpen(false);
  };

  const handleSaveTask = (task) => {
    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setConfirmDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (filter === "All" || task.status === filter) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const paginatedTasks = filteredTasks.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <Container sx={{ my: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
    <CustomToolbar user={user} onLogout={onLogout} />
    <Container sx={{ my: 4 }}>
      <Grid container spacing={2} alignItems="center" sx={{ my: 2 }}>
        <Grid item xs={12} sm={6}>
          <TaskFilter filter={filter} setFilter={setFilter} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid
            container
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
                size="medium"
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <TaskTable
        tasks={paginatedTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        totalCount={filteredTasks.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <TaskModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => deleteTask(taskToDelete.id)}
        title="Confirm Delete"
        content={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
      />
    </Container>
    </>
  );
};

export default TaskPage;
