import React, { useState } from 'react';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { ConferenceContext } from 'pages/AntMedia';

const MessageInputContainer = styled(Grid)(({ theme }) => ({
  padding: '8px 8px 8px 8px',
  background: theme.palette.themeColor[0],
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '16px 0px 8px 0px',
  },
  marginBottom: '15px'
}));
const MessageTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
    backgroundColor: theme.palette.themeColor[20],
    color: '#000000',
    padding: "5px"
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: theme.palette.themeColor[90],
    fontWeight: 400,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: 30,
  },
}));
const MessageInput = React.memo((props) => {
  const conference = React.useContext(ConferenceContext);

  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const currentDate = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedTime = currentDate.toLocaleString('en-US', options);
  const sendMessage = () => {
    if (text) {
      conference.handleSendMessage(text);
      props?.onSendMessage({
        name: 'You',
        message: text,
        date: formattedTime,
      });
      setShowEmojiPicker(false);
      setText('');
    }
  };

  const addEmojiIntoTextBox = (emojiData, event) => {
    setText(text + ' ' + emojiData.emoji);
  };

  const handleEmojiPickerDrawer = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && text.trim().length > 0) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <MessageInputContainer container>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if(text.trim().length > 0) {
            sendMessage();
          }
        }}
      >
        {showEmojiPicker ? (
          <EmojiPicker onEmojiClick={addEmojiIntoTextBox} width='100%' height='45vh' />
        ) : null}
        <MessageTextField
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
          onKeyDown={handleKeyDown}
          multiline
          rows={1}
          InputProps={{
            endAdornment: (
              <InputAdornment position='start'>
                <IconButton
                  onClick={handleEmojiPickerDrawer}
                  aria-label='toggle emoji picker'
                  size={'medium'}
                  edge='end'
                >
                  <Emoji unified={'1f600'} emojiStyle={EmojiStyle.APPLE} size={22} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if(text.trim().length > 0) {
                      sendMessage();
                    }
                  }}
                  aria-label='send message'
                  size={'medium'}
                  edge='end'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='17'
                    viewBox='0 0 20 17'
                    fill='none'
                  >
                    <path
                      d='M0 16.177V0.823047C0 0.525274 0.126405 0.297291 0.379214 0.1391C0.632023 -0.0190921 0.898877 -0.0423556 1.17978 0.0693092L19.4944 7.71835C19.8315 7.86723 20 8.12778 20 8.5C20 8.87222 19.8315 9.13277 19.4944 9.28165L1.17978 16.9307C0.898877 17.0424 0.632023 17.0191 0.379214 16.8609C0.126405 16.7027 0 16.4747 0 16.177ZM1.68539 14.837L16.9663 8.5L1.68539 2.07928V6.7692L8.48315 8.5L1.68539 10.175V14.837ZM1.68539 8.5V2.07928V6.7692V10.175V14.837V8.5Z'
                      fill='#9E9E9E'
                    />
                  </svg>
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          placeholder={t('Send a message')}
          variant='outlined'
        />
      </form>
    </MessageInputContainer>
  );
});

export default MessageInput;
