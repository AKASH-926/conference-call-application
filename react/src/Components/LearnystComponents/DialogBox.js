import * as React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import { SvgComponent } from 'learnystIcons';
import { Box, Typography } from '@mui/material';
import {useTheme} from "@mui/material/styles";

const AntDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const theme = useTheme();
  return (
    <DialogTitle {...other} sx={{ padding: '10px' }}>
      <Typography
        sx={{
          lineHeight: '30px',
          whiteSpace: 'normal', // Allow wrapping
          overflow: 'hidden', // Hide overflow text
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        }}
        variant='body1'
        color={theme.palette.themeColor[90]}
      >
        {children}
      </Typography>
      {onClose ? (
        <Button
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 10,
          }}
        >
          <SvgComponent name='close' width='18px' height='18px' fill={'#000000'} />
        </Button>
      ) : null}
    </DialogTitle>
  );
};

export function DialogBox(props) {
  const { t } = useTranslation();
  const { onClose, open, onExitClicked, primaryAction, dialogDescription, primaryActionText, closeButtonText } = props;

  const handleClose = (event, reason) => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <AntDialogTitle onClose={handleClose}>{dialogDescription}</AntDialogTitle>
      <DialogContent sx={{padding: 0}}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          {primaryAction && (
            <Button
              style={{ marginTop: '0px' }}
              onClick={primaryAction}
              size='medium'
              color='error'
              variant='contained'
              type='submit'
              id='exit_button'
            >
              {primaryActionText}
            </Button>
          )}
          <Button
            style={{ marginTop: '0px' }}
            onClick={onClose}
            size='medium'
            color='primary'
            variant='contained'
            type='submit'
            id='exit_button'
          >
            {closeButtonText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

DialogBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
