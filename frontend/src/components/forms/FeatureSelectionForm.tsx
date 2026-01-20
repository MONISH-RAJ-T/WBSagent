"use client"
import { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
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
    Card,
    CardContent,
} from '@mui/material'
import {
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    SelectAll as SelectAllIcon,
    Deselect as DeselectIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    Science as ScienceIcon,
    Palette as PaletteIcon,
    Storage as StorageIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { Feature, Competitor } from '@/types'

interface FeatureSelectionFormProps {
    features: Feature[]
    competitors?: Competitor[]
    onBack: () => void
    onSubmit: (selectedFeatures: Feature[]) => void
    loading?: boolean
}

export default function FeatureSelectionForm({
    features: initialFeatures,
    competitors = [],
    onBack,
    onSubmit,
    loading = false
}: FeatureSelectionFormProps) {
    const [featureList, setFeatureList] = useState<Feature[]>(initialFeatures)
    const [selectedIds, setSelectedIds] = useState<string[]>(initialFeatures.map(f => f.id))

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false)
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')

    const handleToggle = (id: string) => {
        const currentIndex = selectedIds.indexOf(id)
        const newSelected = [...selectedIds]

        if (currentIndex === -1) {
            newSelected.push(id)
        } else {
            newSelected.splice(currentIndex, 1)
        }

        setSelectedIds(newSelected)
    }

    const handleSelectAll = () => {
        if (selectedIds.length === featureList.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(featureList.map(f => f.id))
        }
    }

    const handleOpenAdd = () => {
        setEditingFeature(null)
        setFormName('')
        setFormDescription('')
        setOpenDialog(true)
    }

    const handleOpenEdit = (feature: Feature) => {
        setEditingFeature(feature)
        setFormName(feature.name)
        setFormDescription(feature.description)
        setOpenDialog(true)
    }

    const handleDelete = (id: string) => {
        setFeatureList(prev => prev.filter(f => f.id !== id))
        setSelectedIds(prev => prev.filter(sid => sid !== id))
    }

    const handleSaveFeature = () => {
        if (!formName.trim()) return

        if (editingFeature) {
            // Update existing
            setFeatureList(prev => prev.map(f =>
                f.id === editingFeature.id
                    ? { ...f, name: formName, description: formDescription }
                    : f
            ))
        } else {
            // Add new
            const newId = `f-${Date.now()}`
            const newFeature: Feature = {
                id: newId,
                name: formName,
                description: formDescription
            }
            setFeatureList(prev => [...prev, newFeature])
            setSelectedIds(prev => [...prev, newId])
        }
        setOpenDialog(false)
    }

    const handleSubmit = () => {
        const selectedFeatures = featureList.filter(f => selectedIds.includes(f.id))
        onSubmit(selectedFeatures)
    }

    return (
        <Box sx={{ py: 2 }} className="animate-fade-in-up stagger-1">
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(102, 126, 234, 0.12)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08)',
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
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
                            Refine Project Features
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.95rem' }}>
                            Review, edit, or add features manually before generating the WBS.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAdd}
                            sx={{
                                borderRadius: 2,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    borderColor: '#764ba2',
                                    background: 'rgba(102, 126, 234, 0.04)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                                }
                            }}
                        >
                            Add Custom Feature
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={selectedIds.length === featureList.length ? <DeselectIcon /> : <SelectAllIcon />}
                            onClick={handleSelectAll}
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            {selectedIds.length === featureList.length ? 'Deselect All' : 'Select All'}
                        </Button>
                        <Chip
                            label={`${selectedIds.length} / ${featureList.length} selected`}
                            color="primary"
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                background: 'rgba(102, 126, 234, 0.04)',
                                borderColor: '#667eea',
                            }}
                        />
                    </Stack>
                </Box>

                {/* Competitor Benchmarking Section */}
                {competitors.length > 0 && (
                    <Box
                        className="animate-fade-in-up stagger-2"
                        sx={{
                            mb: 5,
                            p: 4,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.02) 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(102, 126, 234, 0.15)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                                }}
                            >
                                <BusinessIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" fontWeight="700">
                                Competitor Benchmarking
                            </Typography>
                        </Box>
                        <Grid container spacing={2.5}>
                            {competitors.map((comp, idx) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            borderRadius: 2.5,
                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                                                borderColor: '#667eea',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                            <Typography variant="subtitle2"
                                                fontWeight="700"
                                                gutterBottom
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    mb: 1.5,
                                                }}
                                            >
                                                {comp.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                                {comp.features?.map((feat, fidx) => (
                                                    <Chip
                                                        key={fidx}
                                                        label={feat}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize: '0.7rem',
                                                            height: 22,
                                                            borderRadius: 1.5,
                                                            borderColor: 'rgba(102, 126, 234, 0.3)',
                                                            background: 'rgba(102, 126, 234, 0.04)',
                                                            '&:hover': {
                                                                background: 'rgba(102, 126, 234, 0.1)',
                                                                borderColor: '#667eea',
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 500, overflow: 'auto' }}>
                    {featureList.map((feature) => {
                        const labelId = `checkbox-list-label-${feature.id}`
                        const isSelected = selectedIds.indexOf(feature.id) !== -1

                        return (
                            <ListItem
                                key={feature.id}
                                disablePadding
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    transition: '0.2s',
                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                                    ...(isSelected && { bgcolor: 'rgba(25, 118, 210, 0.04)' })
                                }}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Edit Feature">
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(feature)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Feature">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(feature.id)}>
                                                <DeleteIcon fontSize="small" color="error" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                            >
                                <ListItem
                                    role={undefined}
                                    dense
                                    onClick={() => handleToggle(feature.id)}
                                    sx={{ cursor: 'pointer', pr: 12 }} // Added padding for secondary actions
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={isSelected}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<CheckCircleIcon color="primary" />}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={isSelected ? 'bold' : 'medium'}>
                                                    {feature.name}
                                                </Typography>
                                                {/* Feature Analysis Indicators */}
                                                {feature.analysis && (
                                                    <Box sx={{ display: 'flex', gap: 0.75, mt: 1, flexWrap: 'wrap' }}>
                                                        {feature.analysis.needs_rnd && (
                                                            <Chip
                                                                icon={<ScienceIcon sx={{ fontSize: 14 }} />}
                                                                label="R&D Required"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    color: 'white',
                                                                    '& .MuiChip-icon': { color: 'white' }
                                                                }}
                                                            />
                                                        )}
                                                        {feature.analysis.needs_ui && (
                                                            <Chip
                                                                icon={<PaletteIcon sx={{ fontSize: 14 }} />}
                                                                label="UI/UX Design"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                                                                    color: 'white',
                                                                    '& .MuiChip-icon': { color: 'white' }
                                                                }}
                                                            />
                                                        )}
                                                        {feature.analysis.needs_db && (
                                                            <Chip
                                                                icon={<StorageIcon sx={{ fontSize: 14 }} />}
                                                                label="DB Schema"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                                                    color: 'white',
                                                                    '& .MuiChip-icon': { color: 'white' }
                                                                }}
                                                            />
                                                        )}
                                                        <Chip
                                                            icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
                                                            label={`${feature.analysis.total_hours}h total`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.7rem',
                                                                borderColor: '#10b981',
                                                                color: '#10b981',
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': { color: '#10b981' }
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {feature.description}
                                                </Typography>
                                                {feature.analysis && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                                                        Dev: {feature.analysis.dev_hours}h • Testing: {feature.analysis.unit_test_hours + feature.analysis.qa_hours}h
                                                        {feature.analysis.rnd_hours > 0 && ` • R&D: ${feature.analysis.rnd_hours}h`}
                                                        {feature.analysis.ui_hours > 0 && ` • UI: ${feature.analysis.ui_hours}h`}
                                                        {feature.analysis.db_hours > 0 && ` • DB: ${feature.analysis.db_hours}h`}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </ListItem>
                        )
                    })}
                </List>

                {featureList.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                        <Typography color="text.secondary">No features in the list. Add some features manually!</Typography>
                        <Button startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mt: 2 }}>Add Feature</Button>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="text"
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        disabled={loading}
                    >
                        Back to Details
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleSubmit}
                        disabled={loading || selectedIds.length === 0}
                        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                        Generate WBS Tasks
                    </Button>
                </Box>
            </Paper>

            {/* Add / Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingFeature ? 'Edit Feature' : 'Add New Feature'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="Feature Name"
                            placeholder="e.g., Real-time Chat"
                            fullWidth
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Feature Description"
                            placeholder="Briefly describe what this feature does..."
                            fullWidth
                            multiline
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveFeature} disabled={!formName.trim()}>
                        Save Feature
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
