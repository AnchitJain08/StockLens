import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { StockSelector } from '../components/StockSelector';
import { OptionChainTable } from '../components/OptionChainTable';
import { DetailedMetrics } from '../components/DetailedMetrics';
import { common } from '../styles/theme/common';

const OptionChainPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="main"
      sx={{
        ...common.layout.mainContent,
        ...common.spacing.page,
      }}
    >
      <Box sx={{
        ...common.layout.card,
        borderRadius: common.borderRadius.large,
        boxShadow: common.shadows.card,
        minHeight: `calc(100vh - ${theme.spacing(isMobile ? 4 : 6)})`,
        maxWidth: common.layout.maxWidth,
        transition: common.transitions.default,
        '&:hover': {
          boxShadow: common.shadows.cardHover,
        }
      }}>
        <Box
          sx={{
            ...common.spacing.content,
            flex: 1,
            '& > *:not(:last-child)': {
              mb: 2
            }
          }}
        >
          <StockSelector />
          <DetailedMetrics />
          <OptionChainTable />
        </Box>
      </Box>
    </Box>
  );
};

export default OptionChainPage;
