import { WBSTask } from '@/types'
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Grid,
    Card,
    CardContent,
    Alert,
    alpha
} from '@mui/material'
import {
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Code as CodeIcon,
    Science as ScienceIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

interface WBSTableProps {
    tasks: WBSTask[]
    projectName: string
}

export default function WBSTable({ tasks, projectName }: WBSTableProps) {
    const devTasks = tasks.filter(t => t.task_type === 'Dev')
    const rndTasks = tasks.filter(t => t.task_type === 'R&D')

    const totalHours = tasks.reduce((sum, t) => sum + t.duration_hours, 0)
    const devHours = devTasks.reduce((sum, t) => sum + t.duration_hours, 0)
    const rndHours = rndTasks.reduce((sum, t) => sum + t.duration_hours, 0)

    const stats = [
        {
            label: 'Total Tasks',
            value: tasks.length,
            icon: AssignmentIcon,
            color: '#6366f1',
            bgColor: 'rgba(99, 102, 241, 0.1)'
        },
        {
            label: 'Total Hours',
            value: `${totalHours}h`,
            icon: ScheduleIcon,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
            label: 'Dev Hours',
            value: `${devHours}h`,
            icon: CodeIcon,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)'
        },
        {
            label: 'R&D Hours',
            value: `${rndHours}h`,
            icon: ScienceIcon,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
        }
    ]

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{
                        mb: 2,
                        background: 'linear-gradient(135deg, #1e293b, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    📊 Work Breakdown Structure
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Project: <Typography component="span" fontWeight="600">{projectName}</Typography>
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: '16px',
                                border: `1px solid ${alpha(stat.color, 0.2)}`,
                                background: stat.bgColor,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`
                                }
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '12px',
                                            background: alpha(stat.color, 0.15),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <stat.icon sx={{ fontSize: 24, color: stat.color }} />
                                    </Box>
                                </Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="800"
                                    sx={{ color: stat.color, mb: 0.5 }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight="500">
                                    {stat.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tasks Table */}
            {tasks.length > 0 ? (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        overflow: 'hidden'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))'
                                }}
                            >
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Task Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Hours</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Level</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task, index) => (
                                <TableRow
                                    key={task.id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'rgba(99, 102, 241, 0.04)'
                                        },
                                        bgcolor: index % 2 === 0 ? 'white' : 'rgba(248, 250, 252, 0.5)'
                                    }}
                                >
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontFamily="monospace"
                                            sx={{ color: '#64748b' }}
                                        >
                                            {task.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="600" sx={{ color: '#1e293b' }}>
                                            {task.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {task.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.task_type}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                background: task.task_type === 'Dev'
                                                    ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                                                    : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                                color: 'white',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            fontWeight="700"
                                            sx={{ color: '#6366f1' }}
                                        >
                                            {task.duration_hours}h
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            L{task.level}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 12,
                        px: 3,
                        borderRadius: '20px',
                        border: '2px dashed rgba(99, 102, 241, 0.2)',
                        bgcolor: 'rgba(248, 250, 252, 0.5)'
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        No tasks generated yet
                    </Typography>
                </Box>
            )}

            {/* Info Banner */}
            <Alert
                icon={<CheckCircleIcon />}
                severity="success"
                sx={{
                    mt: 4,
                    borderRadius: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    '& .MuiAlert-icon': {
                        color: '#10b981'
                    }
                }}
            >
                <Typography variant="body1" fontWeight="700" sx={{ mb: 0.5 }}>
                    ✅ 8+2 Rule Applied
                </Typography>
                <Typography variant="body2">
                    Each feature has been broken down into exactly 10 hours:{' '}
                    <Typography component="span" fontWeight="600">8 hours of development</Typography> and{' '}
                    <Typography component="span" fontWeight="600">2 hours of R&D</Typography>.
                </Typography>
            </Alert>
        </Box>
    )
}
