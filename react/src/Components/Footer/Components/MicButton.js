import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { SvgIcon } from '../../SvgIcon';
import { ConferenceContext } from 'pages/AntMedia';
import { Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SvgComponent } from 'learnystIcons';

export const roundStyle = {
  width: { xs: 36, md: 46 },
  height: { xs: 36, md: 46 },
  minWidth: 'unset',
  maxWidth: { xs: 36, md: 46 },
  maxHeight: { xs: 36, md: 46 },
  borderRadius: '50%',
  padding: '4px',
};

export const CustomizedBtn = styled(Button)(({ theme }) => ({
  '&.footer-icon-button': {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: 8,
      minWidth: 'unset',
      width: '100%',
    },
    '& > svg': {
      width: 36
    },
  }
}));


function MicButton(props) {
  const { rounded, footer } = props;
  const conference = useContext(ConferenceContext);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleMute = (e) => {
    e.stopPropagation();
    if (conference.localVideo === null) {
      enqueueSnackbar({
        message: t('You need to allow camera and microphone permissions before muting yourself'),
        variant: 'info',
        icon: <SvgIcon size={24} name={'muted-microphone'} color="#000000" />
      }, {
        autoHideDuration: 1500,
      });
      return
    }
    enqueueSnackbar({
      message: t('Microphone off'),
      variant: 'info',
      // icon: <SvgIcon size={24} name={'muted-microphone'} color="#000000" />
      icon: <SvgComponent name="mutedMicrophone" width="14px" height="18px" fill="#fff"/>
    }, {
      autoHideDuration: 1500,
    });
    conference?.muteLocalMic();
  };

  const handleUnmute = (e) => {
    e.stopPropagation();
    enqueueSnackbar({
      message: t('Microphone on'),
      variant: 'info',
      // icon: <SvgIcon size={24} name={'microphone'} color="#000000" />
      icon: <SvgComponent name="microphone" width="10px" height="10px"/>
    }, {
      autoHideDuration: 1500,
    });
    conference?.unmuteLocalMic();
  };

  return (
    <>
      {conference?.isMyMicMuted ? (
        <Tooltip title={t('Turn on microphone')} placement="top">
          <CustomizedBtn
            id="mic-button"
            disabled={conference?.microphoneButtonDisabled}
            className={footer ? 'footer-icon-button' : ''} variant='contained' sx={rounded ? roundStyle : {}} color="error" onClick={(e) => { handleUnmute(e) }}>
            {/* <SvgIcon size={40} name={'muted-microphone'} color="#ffff" /> */}
            <SvgComponent name="mutedMicrophone" width="18px" height="18px" fill="#fff"/>
          </CustomizedBtn>
        </Tooltip>
      ) : (
        <Tooltip title={t('Turn off microphone')} placement="top">
          <CustomizedBtn
            id="mic-button"
            disabled={conference?.microphoneButtonDisabled}
            className={footer ? 'footer-icon-button' : ''} variant="outlined" color="inherit" sx={rounded ? {...roundStyle }: {"&.footer-icon-button" : {background: 'rgb(0,0,0)'}}} onClick={(e) => { handleMute(e) }}>
            {/* <SvgIcon size={40} name={'microphone'} color='inherit' /> */}
            <SvgComponent name="microphone" width="14px" height="16px" fill="#fff"/>
          </CustomizedBtn>
        </Tooltip>
      )}
    </>
  );
}

export default MicButton;
