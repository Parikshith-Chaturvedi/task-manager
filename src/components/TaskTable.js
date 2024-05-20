import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableSortLabel,
  TablePagination,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";

const TaskTable = ({
  tasks,
  onEdit,
  onDelete,
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ cell }) => {
          const dueDate = cell.getValue();
          const isOverdue =
            dueDate && new Date(dueDate.seconds * 1000) < new Date();
          return (
            <div>
              {isOverdue && (
                <Tooltip title="Task is overdue">
                  <WarningIcon color="error" />
                </Tooltip>
              )}
              {dueDate
                ? new Date(dueDate.seconds * 1000).toLocaleDateString()
                : "No due date"}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <IconButton onClick={() => onEdit(row.original)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(row.original)}>
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const data = useMemo(() => tasks, [tasks]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Table sx={{
      '& .MuiTableCell-sizeMedium': {
        padding: '10px 16px',
      },
    }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <TableSortLabel
                      active={header.column.getIsSorted()}
                      direction={
                        header.column.getIsSorted()
                          ? header.column.getIsSorted()
                          : "asc"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={currentPage}
        onPageChange={onPageChange}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[]}
      />
    </>
  );
};

export default TaskTable;
