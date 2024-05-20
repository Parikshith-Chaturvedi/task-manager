import React from "react";
import { Select, MenuItem } from "@mui/material";

const TaskFilter = ({ filter, setFilter }) => {
  return (
    <Select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      size="small"
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="To Do">To Do</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Done">Done</MenuItem>
    </Select>
  );
};

export default TaskFilter;
