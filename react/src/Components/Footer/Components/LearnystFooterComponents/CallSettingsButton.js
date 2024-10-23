import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SvgIcon } from '../../../SvgIcon';
import { ConferenceContext } from 'pages/AntMedia';
import { Tooltip, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SettingsDialog from '../SettingsDialog';
import { SvgComponent } from 'learnystIcons';

const CustomizedBtn = styled(Button)(({ theme }) => ({
  '&.footer-icon-button': {
    height: '100%',
    background: theme.palette.themeColor[90],
    [theme.breakpoints.down('sm')]: {
      padding: 8,
      minWidth: 'unset',
      width: '100%',
      '& > svg': {
        width: 36,
      },
    },
  },
}));

function CallSettingsButton({ footer, ...props }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectFocus, setSelectFocus] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogClose = (value) => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (focus) => {
    setSelectFocus(focus);
    setDialogOpen(true);
    handleClose();
  };
  return (
    <>
      <SettingsDialog open={dialogOpen} onClose={handleDialogClose} selectFocus={selectFocus} isVideoResolutionDisabled={true}/>
        <Tooltip title={t('Call settings')} placement='top'>
          <CustomizedBtn
            onClick={() => {
              handleDialogOpen();
            }}
            variant='outlined'
            className={footer ? 'footer-icon-button' : ''}
            color={'inherit'}
            sx={{border: '1px solid white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}
          >
            <SvgComponent name={"callSettings"} width="22px" height="14px" fill={dialogOpen  ? "#8ab4f8" : "#ffffff"}/>
          </CustomizedBtn>
        </Tooltip>
    </>
  );
}

export default CallSettingsButton;
