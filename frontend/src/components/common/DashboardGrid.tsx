import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Chip, 
    Avatar, 
    IconButton,
    Button,
    LinearProgress
} from '@mui/material'
import { 
    TrendingUp, 
    Speed, 
    CheckCircle, 
    AccessTime,
    MoreVert,
    PlayArrow,
    Folder,
    Star
} from '@mui/icons-material'

interface ProjectCardProps {
    title: string
    description: string
    progress: number
    tasks: number
    hours: number
    status: 'active' | 'completed' | 'pending'
    lastModified: string
}

export function ProjectCard({ title, description, progress, tasks, hours, status, lastModified }: ProjectCardProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'completed':
                return { color: '#10b981', bg: '#10b98115', icon: CheckCircle, label: 'Completed' }
            case 'active':
                return { color: '#6366f1', bg: '#6366f115', icon: PlayArrow, label: 'In Progress' }
            default:
                return { color: '#f59e0b', bg: '#f59e0b15', icon: AccessTime, label: 'Pending' }
        }
    }

    const statusConfig = getStatusConfig()
    const StatusIcon = statusConfig.icon

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {description}
                        </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                        <MoreVert />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<StatusIcon sx={{ fontSize: 16 }} />}
                        label={statusConfig.label}
                        size="small"
                        sx={{
                            background: statusConfig.bg,
                            color: statusConfig.color,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {lastModified}
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight="600" color="text.secondary">
                            Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="700" color="primary">
                            {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
                                borderRadius: 4
                            }
                        }}
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="800" color="primary">
                                {tasks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Tasks
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="800" color="primary">
                                {hours}h
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Hours
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export function StatsCard({ icon, title, value, change, trend }: {
    icon: React.ElementType
    title: string
    value: string | number
    change: string
    trend: 'up' | 'down'
}) {
    const IconComponent = icon
    const isPositive = trend === 'up'

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: '16px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99, 102, 241, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white'
                        }}
                    >
                        <IconComponent sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Chip
                        icon={<TrendingUp sx={{ fontSize: 14, transform: isPositive ? 'none' : 'rotate(180deg)' }} />}
                        label={change}
                        size="small"
                        sx={{
                            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isPositive ? '#10b981' : '#ef4444',
                            fontWeight: 600
                        }}
                    />
                </Box>
                <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#1e293b' }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default function DashboardGrid() {
    const projects = [
        {
            title: "E-Commerce Platform",
            description: "Full-stack online marketplace with payment integration",
            progress: 85,
            tasks: 24,
            hours: 240,
            status: 'active' as const,
            lastModified: "2 hours ago"
        },
        {
            title: "Mobile Banking App",
            description: "Secure financial application with biometric authentication",
            progress: 100,
            tasks: 18,
            hours: 180,
            status: 'completed' as const,
            lastModified: "1 day ago"
        },
        {
            title: "AI Analytics Dashboard",
            description: "Machine learning powered business intelligence platform",
            progress: 45,
            tasks: 32,
            hours: 320,
            status: 'active' as const,
            lastModified: "5 hours ago"
        }
    ]

    const stats = [
        { icon: Folder, title: "Total Projects", value: 12, change: "+3 this month", trend: 'up' as const },
        { icon: CheckCircle, title: "Completed", value: 8, change: "+2 this week", trend: 'up' as const },
        { icon: AccessTime, title: "Total Hours", value: "1.2k", change: "+120 hours", trend: 'up' as const },
        { icon: Star, title: "Success Rate", value: "94%", change: "+2% improvement", trend: 'up' as const }
    ]

    return (
        <Box sx={{ p: 4 }}>
            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatsCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Projects Grid */}
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3, color: '#1e293b' }}>
                Recent Projects
            </Typography>
            <Grid container spacing={3}>
                {projects.map((project, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <ProjectCard {...project} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}