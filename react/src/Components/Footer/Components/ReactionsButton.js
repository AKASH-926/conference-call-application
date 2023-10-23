import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { SvgIcon } from '../../SvgIcon';
import { ConferenceContext } from 'pages/AntMedia';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { FacebookSelector } from '@charkour/react-reactions';

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


function ReactionsButton(props) {
  const { rounded, footer } = props;
  const conference = useContext(ConferenceContext);
  const { t } = useTranslation();

  const [showEmojis, setShowEmojis] = React.useState(false);
  function sendEmoji(emoji) {
    conference?.sendReactions(emoji);
    setShowEmojis(!showEmojis);
  }

  return (
    <>
        {showEmojis && (
            <FacebookSelector onSelect={sendEmoji} />
        )}
        <Tooltip title={t('Emoji')} placement="top">
          <CustomizedBtn className={footer ? 'footer-icon-button' : ''} variant="contained" color={'secondary'} sx={rounded ? roundStyle : {}} onClick={(e) => { setShowEmojis(!showEmojis) }}>
            <SvgIcon size={40} name={'smiley-face'} color="#fff" />
          </CustomizedBtn>
        </Tooltip>
    </>
  );
}

export default ReactionsButton;
