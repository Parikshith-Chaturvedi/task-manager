import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TaskModal = ({ open, onClose, onSave, initialTask }) => {
  const [task, setTask] = useState({ title: '', description: '', status: 'To Do', dueDate: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    } else {
      setTask({ title: '', description: '', status: 'To Do', dueDate: null });
    }
  }, [initialTask]);

  useEffect(() => {
    if (!open) {
      setTask({ title: '', description: '', status: 'To Do', dueDate: null });
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTask((prev) => ({ ...prev, dueDate: date }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = task.title ? '' : 'Title is required';
    tempErrors.description = task.description ? '' : 'Description is required';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSave = () => {
    if (validate()) {
      console.log("Saving task:", task);
      onSave(task);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          name="title"
          label="Title"
          value={task.title}
          onChange={handleChange}
          required
          fullWidth
          margin="dense"
          size="small"
          error={Boolean(errors.title)}
          helperText={errors.title}
        />
        <TextField
          name="description"
          label="Description"
          value={task.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="dense"
          size="small"
          error={Boolean(errors.description)}
          helperText={errors.description}
        />
        <DatePicker
          label="Due Date"
          value={task.dueDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth margin="dense" size="small" />}
        />
        <TextField
          select
          name="status"
          label="Status"
          value={task.status}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        >
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained" size="small">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
