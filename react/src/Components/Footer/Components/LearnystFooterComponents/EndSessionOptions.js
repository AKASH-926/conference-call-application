import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ConferenceContext } from 'pages/AntMedia';
import { SvgComponent } from 'learnystIcons';
import { leaveLearnystRoom } from 'LearnystUtils/socketUtils';
import { endLiveWebinar } from 'LearnystUtils/commonUtils';
import { WEBINAR_END_BUFFER_TIME } from 'learnystConstants';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DialogBox } from 'Components/LearnystComponents/DialogBox';

const CustomizedBtn = styled(Button)(({ theme }) => ({
  '&.footer-icon-button': {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: 8,
      minWidth: 'unset',
      width: '100%',
    },
    '& > svg': {
      width: 26,
    },
  },
}));

function EndSessionOptions({ footer, ...props }) {
  const conference = useContext(ConferenceContext);
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [showEndingDialog, setShowEndingDialog] = useState(false);
  const [endingMessage, setEndingMessage] = useState('');
  const sessionConfigData = conference?.sessionConfigData;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [closeSessionAction, setCloseSessionAction] = useState({ action: '', closeSessionMsg: '' });
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!conference.isPlayOnly && sessionConfigData?.sessionEndTime) {
      const sessionEndTime = new Date(sessionConfigData?.sessionEndTime).getTime();
      const newEndTime = new Date(sessionEndTime + WEBINAR_END_BUFFER_TIME);
      const checkTimeRemaining = () => {
        const currentTime = new Date().getTime();
        const timeRemaining = newEndTime - currentTime;
        if (timeRemaining <= 10 * 60 * 1000 && timeRemaining > 10 * 59 * 1000) {
          setEndingMessage(
            t(
              'Your webinar duration has reached the allotted time. The session will automatically end in 10 minutes.'
            )
          );
          setShowEndingDialog(true);
        }

        if (timeRemaining <= 2 * 60 * 1000 && timeRemaining > 2 * 59 * 1000) {
          setEndingMessage(
            t(
              'Your webinar duration has exceeded the allotted time. The session will automatically end in 2 minutes.'
            )
          );
          setShowEndingDialog(true);
        }

        if (timeRemaining <= 0) {
          endSession();
        }
      };

      const intervalId = setInterval(checkTimeRemaining, 1000); // Check every second

      return () => clearInterval(intervalId); // Clean up interval on unmount
    }
  }, []);

  const endSession = () => {
    conference.setLeftTheRoom(true);
    leaveLearnystRoom();
    clearInterval(conference.learnystSocketHeartBeatRef.current);
    endLiveWebinar();
  };

  const exitSession = () => {
    conference.setLeftTheRoom(true);
    leaveLearnystRoom();
    clearInterval(conference.learnystSocketHeartBeatRef.current);
  };

  return (
    <>
      <Tooltip title={t('Leave call')} placement='top'>
        <CustomizedBtn
          id='leave-room-button'
          onClick={(e) => handleClick(e)}
          className={footer ? 'footer-icon-button' : ''}
          variant='contained'
          color='error'
        >
          <SvgComponent name={'endCall'} width='24px' height='20px' />
        </CustomizedBtn>
      </Tooltip>
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
            minWidth: '180px',
            padding: '10px',
            overflow: 'unset',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setShowDialog(true);
            handleClose();
            setCloseSessionAction({
              ...closeSessionAction,
              action: 'exit',
              closeSessionMsg: conference.isPlayOnly
                ? 'Are you sure. You want to exit the live session ?'
                : 'Are you sure you want to exit ? Once you exit, You can rejoin and continue.',
            });
          }}
        >
          <Typography color={'black'}>{t('Exit Session')}</Typography>
        </MenuItem>

        {!conference.isPlayOnly && (
          <MenuItem
            onClick={() => {
              setShowDialog(true);
              handleClose();
              setCloseSessionAction({
                ...closeSessionAction,
                action: 'end',
                closeSessionMsg:
                  'Are you sure you want to end ? Once you end, The session will be considered as Ended / Completed.',
              });
            }}
          >
            <Typography color={'error'}>{t('End Session')}</Typography>
          </MenuItem>
        )}
      </Menu>
      <DialogBox
        open={showDialog}
        onClose={() => setShowDialog(false)}
        primaryAction={() => {
          closeSessionAction.action === 'exit' ? exitSession() : endSession();
        }}
        closeButtonText={'No'}
        primaryActionText={'Yes'}
        dialogDescription={closeSessionAction.closeSessionMsg}
      />
      <DialogBox
        open={showEndingDialog}
        onClose={() => setShowEndingDialog(false)}
        dialogDescription={endingMessage}
        closeButtonText={'Okay'}
      />
    </>
  );
}

export default EndSessionOptions;
