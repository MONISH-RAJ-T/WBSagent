"use client"
import { useState, useMemo, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Divider,
    IconButton,
    Tooltip,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment,
} from '@mui/material'
import {
    ArrowForward as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    AccessTime as AccessTimeIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material'
import { WBSTask } from '@/types'

interface WBSTaskEditorProps {
    tasks: WBSTask[]
    projectName: string
    onBack: () => void
    onExport: (tasks: WBSTask[], format: 'excel' | 'csv' | 'json') => void
}

export default function WBSTaskEditor({
    tasks: initialTasks,
    projectName,
    onBack,
    onExport,
}: WBSTaskEditorProps) {
    const [taskList, setTaskList] = useState<WBSTask[]>(initialTasks)

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false)
    const [editingTask, setEditingTask] = useState<WBSTask | null>(null)
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [formDuration, setFormDuration] = useState<number>(4)

    // Calculate totals
    const totalHours = useMemo(() => {
        return taskList.reduce((acc, task) => acc + (Number(task.duration_hours) || 0), 0)
    }, [taskList])

    const handleOpenAdd = () => {
        setEditingTask(null)
        setFormName('')
        setFormDescription('')
        setFormDuration(4)
        setOpenDialog(true)
    }

    const handleOpenEdit = (task: WBSTask) => {
        setEditingTask(task)
        setFormName(task.name)
        setFormDescription(task.description)
        setFormDuration(task.duration_hours)
        setOpenDialog(true)
    }

    const handleDelete = (id: string) => {
        setTaskList(prev => prev.filter(t => t.id !== id))
    }

    const handleSaveTask = () => {
        if (!formName.trim()) return

        if (editingTask) {
            setTaskList(prev => prev.map(t =>
                t.id === editingTask.id
                    ? { ...t, name: formName, description: formDescription, duration_hours: formDuration }
                    : t
            ))
        } else {
            const newId = `t-${Date.now()}`
            const newTask: WBSTask = {
                id: newId,
                name: formName,
                description: formDescription,
                duration_hours: formDuration,
                level: 1,
                dependencies: [],
                task_type: 'Dev'
            }
            setTaskList(prev => [...prev, newTask])
        }
        setOpenDialog(false)
    }

    return (
        <Box sx={{ py: 2 }} className="animate-fade-in-up stagger-1">
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08)',
                    border: '1px solid rgba(102, 126, 234, 0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    }
                }}
            >
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 56,
                                height: 56,
                                borderRadius: 2.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.25)',
                            }}
                        >
                            <AssignmentIcon sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="800"
                                gutterBottom
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Project Work Breakdown Structure
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                                {projectName}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box
                            sx={{
                                textAlign: 'right',
                                p: 2.5,
                                borderRadius: 2.5,
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.2,
                                    fontWeight: 600,
                                    display: 'block',
                                    mb: 0.5,
                                }}
                            >
                                Total Estimated Effort
                            </Typography>
                            <Typography
                                variant="h4"
                                fontWeight="800"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {totalHours} <Typography component="span" variant="h6" sx={{ opacity: 0.7 }}>hours</Typography>
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAdd}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                borderColor: '#667eea',
                                color: '#667eea',
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: '#764ba2',
                                    background: 'rgba(102, 126, 234, 0.04)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                                }
                            }}
                        >
                            Add Task
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                {/* Tasks Table */}
                <TableContainer component={Box} sx={{ maxHeight: 600, overflow: 'auto' }}>
                    <Table stickyHeader aria-label="wbs tasks table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Task Details</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Duration (Hrs)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {taskList.map((task) => (
                                <TableRow
                                    key={task.id}
                                    sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }, transition: '0.2s' }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                            <AssignmentIcon color="action" sx={{ mt: 0.5 }} fontSize="small" />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {task.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.task_type}
                                            size="small"
                                            color={task.task_type === 'Dev' ? 'primary' : 'secondary'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="medium">
                                            {task.duration_hours}h
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" onClick={() => handleOpenEdit(task)} color="info">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(task.id)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider sx={{ my: 4 }} />

                {/* Footer Actions */}
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    background: 'rgba(102, 126, 234, 0.04)',
                                    color: '#667eea',
                                }
                            }}
                        >
                            Refine Features
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mr: 1, alignSelf: 'center', fontWeight: 600 }}
                            >
                                Export Final WBS:
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                onClick={() => onExport(taskList, 'excel')}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                                    borderRadius: 2,
                                    px: 3,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)',
                                    }
                                }}
                            >
                                Excel
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<FileDownloadIcon />}
                                onClick={() => onExport(taskList, 'csv')}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    px: 3,
                                    '&:hover': {
                                        borderColor: '#764ba2',
                                        background: 'rgba(102, 126, 234, 0.04)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                CSV
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Task Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingTask ? 'Edit WBS Task' : 'Add New Task'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="Task Name"
                            fullWidth
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Task Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                        <TextField
                            label="Estimated Duration"
                            type="number"
                            fullWidth
                            value={formDuration}
                            onChange={(e) => setFormDuration(Number(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveTask} disabled={!formName.trim()}>
                        Save Task
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
