import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SaveIcon from '@mui/icons-material/Save';
import { Feature } from '@/types';

interface FlowEditorProps {
    projectName: string;
    description: string;
    features: Feature[];
    onSave: (features: Feature[]) => void;
    onBack: () => void;
}

const FlowEditor: React.FC<FlowEditorProps> = ({
    projectName,
    description,
    features,
    onSave,
    onBack
}) => {
    const [orderedFeatures, setOrderedFeatures] = useState<Feature[]>([]);

    useEffect(() => {
        // Initialize with current features (already ordered by AI)
        const sorted = [...features].sort((a, b) => {
            const orderA = a.execution_order ?? 999;
            const orderB = b.execution_order ?? 999;
            return orderA - orderB;
        });
        setOrderedFeatures(sorted);
    }, [features]);

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newFeatures = [...orderedFeatures];
        [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
        updateExecutionOrder(newFeatures);
    };

    const moveDown = (index: number) => {
        if (index === orderedFeatures.length - 1) return;
        const newFeatures = [...orderedFeatures];
        [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
        updateExecutionOrder(newFeatures);
    };

    const updateExecutionOrder = (newFeatures: Feature[]) => {
        const updated = newFeatures.map((f, i) => ({
            ...f,
            execution_order: i + 1
        }));
        setOrderedFeatures(updated);
    };

    const handleSave = () => {
        onSave(orderedFeatures);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, minHeight: '500px' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Execution Flow - Review Feature Order
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Features are automatically ordered by AI. Use arrows to manually adjust if needed.
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Save &amp; Continue
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List>
                {orderedFeatures.map((feature, index) => (
                    <ListItem
                        key={feature.id}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: 'background.paper',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                        secondaryAction={
                            <Box>
                                <IconButton
                                    edge="end"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    size="small"
                                >
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => moveDown(index)}
                                    disabled={index === orderedFeatures.length - 1}
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </Box>
                        }
                    >
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        {index + 1}. {feature.name}
                                    </Typography>
                                    {feature.category_name && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                bgcolor: 'primary.light',
                                                color: 'primary.contrastText',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            {feature.category_name}
                                        </Typography>
                                    )}
                                </Box>
                            }
                            secondary={
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                    {feature.reasoning && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontStyle: 'italic', mt: 0.5, display: 'block' }}
                                        >
                                            💡 {feature.reasoning}
                                        </Typography>
                                    )}
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ mt: 3 }}>
                <Button onClick={onBack} variant="text">
                    Back
                </Button>
            </Box>
        </Paper>
    );
};

export default FlowEditor;
