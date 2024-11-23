import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, TextField, Box, Typography, Grid, useTheme } from '@mui/material';
import { RootState } from '../store/store';
import { setSelectedStock } from '../store/optionChainSlice';
import { api } from '../services/api';
import { common } from '../styles/theme/common';

// Professional color palette
const colors = {
    surface: '#FFFFFF',
    primary: '#2962FF',
    secondary: '#6B7280',
    text: '#111827',
    textLight: '#4B5563',
    hover: '#F3F4F6',
    focusRing: 'rgba(41, 98, 255, 0.12)',
    shadow: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.08)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.08)'
    }
};

export const StockSelector: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const selectedStock = useSelector((state: RootState) => state.optionChain.selectedStock);
    const [indices, setIndices] = useState<string[]>([]);
    const [equities, setEquities] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'indices' | 'equities' | null>(null);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const { indices: indicesData, equities: equitiesData } = await api.getStocks();
                setIndices(indicesData);
                setEquities(equitiesData);
            } catch (error) {
                console.error('Error fetching stocks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const handleSelectionChange = (type: 'indices' | 'equities', newValue: string | null) => {
        if (newValue) {
            dispatch(setSelectedStock({ symbol: newValue }));
            setSelectedType(type);
        } else if (selectedType === type) {
            dispatch(setSelectedStock({ symbol: '' }));
            setSelectedType(null);
        }
    };

    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
        width: '100%',
        maxWidth: '100%',
    };

    const sectionStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
    };

    const labelStyles = {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'rgba(0, 0, 0, 0.87)',
        mb: 0.5,
        letterSpacing: '-0.01em',
    };

    const selectStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '16px',
            transition: 'all 0.2s ease-in-out',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.12)',
                border: '1px solid rgba(0, 122, 255, 0.3)',
            }
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        }
    };

    return (
        <Box sx={containerStyles}>
            <Grid 
                container 
                spacing={{ xs: 1, sm: 2 }} 
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={5}>
                    <Box sx={sectionStyles}>
                        <Typography sx={{ ...common.typography.h6, ...labelStyles }}>Indices</Typography>
                        <Autocomplete
                            options={indices}
                            sx={{
                                ...selectStyles,
                                '& .MuiOutlinedInput-root': {
                                    ...selectStyles['& .MuiOutlinedInput-root'],
                                    minHeight: '40px',
                                    '& .MuiOutlinedInput-input': {
                                        padding: '4px 8px',
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                        right: '8px',
                                    },
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select Index"
                                    fullWidth
                                />
                            )}
                            value={selectedType === 'indices' ? selectedStock?.symbol : null}
                            onChange={(_, newValue) => handleSelectionChange('indices', newValue)}
                            isOptionEqualToValue={(option, value) => option === value}
                            filterOptions={(options, { inputValue }) => {
                                const searchTerm = inputValue.toLowerCase();
                                return options.filter(option => 
                                    option.toLowerCase().includes(searchTerm)
                                );
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: { xs: 0.5, sm: '24px !important' }
                }}>
                    <Typography sx={{ ...common.typography.subtitle2, color: 'rgba(0, 0, 0, 0.47)' }}>
                        OR
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Box sx={sectionStyles}>
                        <Typography sx={{ ...common.typography.h6, ...labelStyles }}>Equities</Typography>
                        <Autocomplete
                            options={equities}
                            sx={{
                                ...selectStyles,
                                '& .MuiOutlinedInput-root': {
                                    ...selectStyles['& .MuiOutlinedInput-root'],
                                    minHeight: '40px',
                                    '& .MuiOutlinedInput-input': {
                                        padding: '4px 8px',
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                        right: '8px',
                                    },
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select Stock"
                                    fullWidth
                                />
                            )}
                            value={selectedType === 'equities' ? selectedStock?.symbol : null}
                            onChange={(_, newValue) => handleSelectionChange('equities', newValue)}
                            isOptionEqualToValue={(option, value) => option === value}
                            filterOptions={(options, { inputValue }) => {
                                const searchTerm = inputValue.toLowerCase();
                                return options.filter(option => 
                                    option.toLowerCase().includes(searchTerm)
                                );
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
