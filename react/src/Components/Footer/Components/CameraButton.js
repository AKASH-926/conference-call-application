import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
// import { SvgIcon } from "../../SvgIcon";
import { ConferenceContext } from "pages/AntMedia";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { SvgComponent } from "learnystIcons";


const CustomizedBtn = styled(Button)(({ theme }) => ({
  "&.footer-icon-button": {
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: 8,
      minWidth: "unset",
      width: "100%",
    },
    "& > svg": {
      width: 36,
    },
  },
}));

function CameraButton(props) {
  const { rounded, footer } = props;
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const conference = useContext(ConferenceContext);

  const handleOff = (e) => {
    e.stopPropagation();
    if (conference.isPlayOnly === null) {
      enqueueSnackbar({
        message: t('You need to allow camera and microphone permissions turning off your camera'),
        variant: 'info',
        // icon: <SvgIcon size={24} name={'muted-microphone'} color="#000000" />
        icon:   <SvgComponent name="mutedMicrophone" width="22px" height="20px" fill="inherit" />
      }, {
        autoHideDuration: 1500,
      });
      return
    }
      if (conference.publishStreamId) {
        conference.checkAndTurnOffLocalCamera(conference.publishStreamId);
        conference.handleSendNotificationEvent(
          "CAM_TURNED_OFF",
          conference.publishStreamId
        );
      } else {
        // if local
        conference.checkAndTurnOffLocalCamera("localVideo");
      }

  };
  const handleOn = (e) => {
    e.stopPropagation();
    if (conference.publishStreamId) {
      conference.checkAndTurnOnLocalCamera(conference.publishStreamId);
      conference.handleSendNotificationEvent(
        "CAM_TURNED_ON",
        conference.publishStreamId
      );
    } else {
      // if local
      conference.checkAndTurnOnLocalCamera("localVideo");
    }
  };
  const roundStyle = {
    width: { xs: 36, md: 46 },
    height: { xs: 36, md: 46 },
    minWidth: "unset",
    maxWidth: { xs: 36, md: 46 },
    maxHeight: { xs: 36, md: 46 },
    borderRadius: "50%",
    padding: "4px",
  };

  return (
    // <>
    //   {conference?.isMyCamTurnedOff ? (
    //     <Tooltip title={t('Turn on camera')} placement="top">
    //       <CustomizedBtn
    //         id="camera-button"
    //         className={footer ? 'footer-icon-button' : ''} variant="contained" color="error" sx={rounded ? roundStyle : {}} disabled={conference?.cameraButtonDisabled} onClick={(e) => handleOn(e)}>
    //         <SvgIcon size={40} name={'camera-off'} color="#fff" />
    //       </CustomizedBtn>
    //      </Tooltip>
    //   ) : (
    //     <Tooltip title={t('Turn off camera')} placement="top">
    //       <CustomizedBtn
    //         id="camera-button"
    //         className={footer ? 'footer-icon-button' : ''} variant="contained" color="primary" sx={rounded ? roundStyle : {}} disabled={conference?.cameraButtonDisabled} onClick={(e) => handleOff(e)}>
    //         <SvgIcon size={40} name={'camera'} color='inherit' />
    //       </CustomizedBtn>
    //     </Tooltip>
    //   )}
    // </>
    //learnyst changes
    <>
    {conference?.isMyCamTurnedOff ? (
      <Tooltip title={conference?.isScreenShared ? t('Stop presenting to enable only the camera.') :t('Turn on camera')} placement="top">
        <CustomizedBtn
          id="camera-button"
          className={footer ? 'footer-icon-button' : ''} variant='contained' color={conference?.isScreenShared ? 'secondary' :'error'} sx={rounded ? roundStyle : {}} disabled={conference?.cameraButtonDisabled} onClick={(e) => handleOn(e)}>
          {/* <SvgIcon size={40} name={'camera-off'} color="#ffff" /> */}
          <SvgComponent name="cameraOff" width="20px" height="20px" fill="#fff"/>
        </CustomizedBtn>
       </Tooltip>
    ) : (
      <Tooltip title={conference?.isScreenShared ? t('Stop presenting to enable only the camera.') :t('Turn off camera')} placement="top">
        <CustomizedBtn
          id="camera-button"
          className={footer ? 'footer-icon-button' : ''} variant= {conference?.isScreenShared ? "contained" : "outlined"} color= {conference?.isScreenShared ? "secondary" :"inherit"} sx={rounded ? {...roundStyle} : {"&.footer-icon-button" : {background: 'rgb(0,0,0)'}}} disabled={conference?.cameraButtonDisabled} onClick={(e) => handleOff(e)} >
          {/* <SvgIcon size={40} name={'camera'} color='inherit' /> */}
          <SvgComponent name="camera" width="22px" height="18px" fill="#fff"/>
        </CustomizedBtn>
      </Tooltip>
    )}
  </>
  );
}

export default CameraButton;
