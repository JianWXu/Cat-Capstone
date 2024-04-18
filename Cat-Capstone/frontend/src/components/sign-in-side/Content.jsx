import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';


import imageSrc from '../../assets/cat-yoga.png'



export default function Content() {
  return (
    <Stack
      flexDirection="column"
      alignSelf="center"
      gap={4}
      sx={{
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      </Box>
      {/* Render the image */}
      <img src={imageSrc} alt="cat yoga" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div>
        <Typography fontWeight="medium" gutterBottom>
          Your Title
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your Description
        </Typography>
      </div>
    </Stack>
  );
}
