import * as React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { SvgIcon } from 'Components/SvgIcon';
import { useTranslation } from 'react-i18next';
import { SvgComponent } from 'learnystIcons';
import { Box } from '@mui/material';

const AntDialogTitle = props => {
  const { children, onClose, ...other } = props;

  
  return (
    <DialogTitle {...other}>
      {children}
      {onClose ? (
        <Button
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            // right: 26,
            // top: 27,
            right: 0,
            top: 10,
          }}
        >
          {/* <SvgIcon size={30} name={'close'} color={'white'} /> */}
          <SvgComponent name="close" width="18px" height="18px" fill={"#000000"}/>
        </Button>
      ) : null}
    </DialogTitle>
  );
};

export function UnauthrorizedDialog(props) {
  const { t } = useTranslation();
  const { onClose, open, onExitClicked } = props;


  const handleClose = (event, reason) => {
    onClose();
    window.location.reload()
  };
 


  const exitClicked = (e) =>{
    onExitClicked()
    window.location.reload()
  }

  return (
    <Dialog onClose={handleClose} open={open}  maxWidth={'sm'}>
      <AntDialogTitle onClose={handleClose}>{t('You are not authorized to join this live session.')}</AntDialogTitle>
      <DialogContent>
       
    <Box sx={{display:'flex',justifyContent: 'flex-end'}}>
    <Button
                  style={{marginTop:'0px'}}

            onClick={exitClicked}
            size='medium'
            color="primary"
            variant="contained"
            type="submit"
            id="exit_button"
        >
        {t("Okay")}
        </Button>
    </Box>



      </DialogContent>
    </Dialog>
  );
}

UnauthrorizedDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
