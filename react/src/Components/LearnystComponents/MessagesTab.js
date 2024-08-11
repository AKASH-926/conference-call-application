import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, useTheme } from '@mui/material';
import MessageCard from 'Components/Cards/MessageCard';
import { useTranslation } from 'react-i18next';

const TextContainer = styled(Grid)(({ theme }) => ({
  padding: '10px 18px 8px 18px',
  background: theme.palette.themeColor[20],
  borderRadius: 6,
  color: theme.palette.themeColor[85],
}));

function MessagesTab(props) {
  const { messages = [] } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const memoizedMessageList = React.useMemo(() => {
    return (
      <>
        {messages?.map((m, index) => {
          return (
            <Grid item key={index} xs={12}>
              <MessageCard
                date={m.date}
                isMe={m?.eventType ? false : true}
                name={m.name}
                message={m.message}
              />
            </Grid>
          );
        })}
      </>
    );
  }, [messages]);

  return (
    <>
      <TextContainer item container>
        <Typography
          color={theme.palette.themeColor[90]}
          style={{ fontSize: 12 }}
          variant='body2'
          align='center'
        >
          {t('Messages can only be seen by people in the call and are deleted when the call ends.')}
        </Typography>
      </TextContainer>
      <Grid
        item
        container
        sx={{ mt: 1 }}
        id='paper-props'
        style={{ flexWrap: 'nowrap', flex: 'auto', overflowY: 'auto' }}
      >
        {' '}
        <Grid item xs={12}>
          {memoizedMessageList}
          <div ref={messagesEndRef} />
        </Grid>
      </Grid>
    </>
  );
}

export default MessagesTab;
