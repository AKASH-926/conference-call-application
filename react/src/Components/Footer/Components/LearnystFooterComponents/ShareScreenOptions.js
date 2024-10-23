import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { ConferenceContext } from 'pages/AntMedia';
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SvgComponent } from 'learnystIcons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemText, ListItemIcon } from '@mui/material';

const CustomizedBtn = styled(Button)(({ theme }) => ({
  '&.footer-icon-button': {
    height: '100%',
    background: theme.palette.themeColor[90],
    [theme.breakpoints.down('sm')]: {
      padding: 8,
      minWidth: 'unset',
      width: '100%',
    },
    '& > svg': {
      width: 36,
    },
  },
}));

function ShareScreenOptions({ footer, ...props }) {
  const { t } = useTranslation();
  const conference = useContext(ConferenceContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to stop the media stream
  function stopMediaStreamFromVideo() {
    conference.stopScreenShare();
  }

  return (
    <>
      <Tooltip
        title={conference.isScreenShared ? t('Stop presenting?') : t('Present now')}
        placement='top'
      >
        <CustomizedBtn
          className={footer ? 'footer-icon-button' : ''}
          id='share-screen-button'
          variant='outlined'
          color={'inherit'}
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => {
            conference.isScreenShared
              ? stopMediaStreamFromVideo(conference.publishStreamId)
              : handleClick(e);
          }}
          sx={{ border: '2px solid white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
        >
          <SvgComponent
            name={'shareScreenOff'}
            width='22px'
            height='14px'
            fill={conference.isScreenShared ? '#8ab4f8' : '#ffffff'}
          />
        </CustomizedBtn>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              minWidth: '200px',
              padding: '10px',
              overflow: 'unset',
            },
          }}
        >
          <Tooltip title={t('Share screen Only')} placement='top'>
            <MenuItem
              onClick={() => {
                conference.switchVideoMode('screen');
                handleClose();
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '110px',
                }}
              >
                <ListItemText id='general-button'>{t('Share screen only')}</ListItemText>
                <ListItemIcon sx={{ marginBottom: '10px' }}>
                  <SvgComponent name='screen' width='25px' height='15px' fill='#fff' />
                </ListItemIcon>
              </Box>
            </MenuItem>
          </Tooltip>
          <Tooltip title={t('Share screen with camera on Top Left Corner')} placement='top'>
            <MenuItem
              onClick={() => {
                conference.switchVideoMode('screenwithcamera', 'top-left');
                handleClose();
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignContent: 'center',
                  gap: '25px',
                }}
              >
                <ListItemText>{t('Share screen with camera - 1')}</ListItemText>
                <ListItemIcon sx={{ marginBottom: '10px' }}>
                  <SvgComponent name='topLeft' width='25px' height='15px' fill='#fff' />
                </ListItemIcon>
              </Box>
            </MenuItem>
          </Tooltip>
          <Tooltip title={t('Share screen with camera on Bottom Left Corner')} placement='top'>
            <MenuItem
              onClick={() => {
                conference.switchVideoMode('screenwithcamera', 'bottom-left');
                handleClose();
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <ListItemText>{t('Share screen with camera - 2')}</ListItemText>
                <ListItemIcon sx={{ marginBottom: '10px' }}>
                  <SvgComponent name='bottomLeft' width='25px' height='15px' fill='#fff' />
                </ListItemIcon>
              </Box>
            </MenuItem>
          </Tooltip>
          <Tooltip title={t('Share screen with camera on Top Right Corner')} placement='top'>
            <MenuItem
              onClick={() => {
                conference.switchVideoMode('screenwithcamera', 'top-right');
                handleClose();
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <ListItemText>{t('Share screen with camera - 3')}</ListItemText>
                <ListItemIcon sx={{ marginBottom: '10px' }}>
                  <SvgComponent name='topRight' width='25px' height='15px' fill='#fff' />
                </ListItemIcon>
              </Box>
            </MenuItem>
          </Tooltip>
          <Tooltip title={t('Share screen with camera on Bottom Right Corner')} placement='top'>
            <MenuItem
              onClick={() => {
                conference.switchVideoMode('screenwithcamera', 'bottom-right');
                handleClose();
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <ListItemText>{t('Share screen with camera - 4')}</ListItemText>
                <ListItemIcon sx={{ marginBottom: '10px' }}>
                  <SvgComponent
                    name='bottomRight'
                    width='25px'
                    height='15px'
                    fill='#fff'
                    sx={{ marginLeft: '8px' }}
                  />
                </ListItemIcon>
              </Box>
            </MenuItem>
          </Tooltip>
        </Menu>
      </Tooltip>
    </>
  );
}

export default ShareScreenOptions;
