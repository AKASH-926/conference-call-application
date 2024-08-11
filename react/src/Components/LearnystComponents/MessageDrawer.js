import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { Grid, Tabs, Tab } from '@mui/material';
import MessageInput from './MessageInput';
import { useTranslation } from 'react-i18next';
import MessagesTab from './MessagesTab';
import CloseDrawerButton from '../DrawerButton';
import { getAntDrawerStyle } from 'styles/themeUtil';
import { ConferenceContext } from 'pages/AntMedia';
import {
  handleSocketActions,
} from 'LearnystUtils/socketUtils';
import { LEARNYST_ROOM_TYPE, LEARNYST_SOCKET_COMMANDS, LEARNYST_SOCKET_NOTIFICATIONS, MESSAGE_TYPE } from 'learnystConstants';

const AntDrawer = styled(Drawer)(({ theme }) => getAntDrawerStyle(theme));

const MessageGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  padding: 16,
  background: theme.palette.themeColor[0],
  borderRadius: 10,
}));
const TabGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  paddingBottom: 16,
  paddingTop: 16,
  flexWrap: 'nowrap',
}));

const MessageDrawer = React.memo((props) => {
  const [value, setValue] = React.useState(0);
  const [messages, setMessages] = React.useState([]);
  const conference = React.useContext(ConferenceContext);
  const { t } = useTranslation();

  const appendMessage = (messageData) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: messageData.message,
        name: messageData.name,
        date: messageData.date,
        eventType: messageData?.eventType,
      },
    ]);
  };

  React.useEffect(() => {
    const notification = conference?.learnystChatNotification || []
    const data = notification[notification?.length - 1]
         if (data?.notification === LEARNYST_SOCKET_NOTIFICATIONS.NEW_MESSAGE) {
            try {
                let messageData = JSON.parse(data?.notification_data?.msg?.text);
                messageData['eventType'] = 'MESSAGE_RECEIVED';
                messageData['name'] = data?.user_data?.user_name;
                appendMessage(messageData);
            } catch (e) {
                console.log('error', e);
            }
        }
}, [conference.learnystChatNotification]);

  const sendMessage = (message) => {
    const actionData = {
      command: LEARNYST_SOCKET_COMMANDS.SEND_MSG,
      roomType: LEARNYST_ROOM_TYPE.LIVE_CLASS_CHAT,
      message: JSON.stringify(message),
      messageType: MESSAGE_TYPE.TEXT
    };
    appendMessage({
      message: message.message,
      name: message.name,
      date: message.date,
      eventType: null,
    });
    handleSocketActions(actionData, (respone) => {
      console.log('response', respone);
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = React.useMemo(() => {
    return (props) => {
      const { children, value, index, ...other } = props;
      return (
        <div
          role='tabpanel'
          hidden={value !== index}
          id={`drawer-tabpanel-${index}`}
          aria-labelledby={`drawer-tab-${index}`}
          {...other}
          style={{ height: '100%', width: '100%', overflowY: 'auto' }}
        >
          {value === index && children}
        </div>
      );
    };
  }, []);

  function a11yProps(index) {
    return {
      id: `drawer-tab-${index}`,
      'aria-controls': `drawer-tabpanel-${index}`,
    };
  }

  return (
    <AntDrawer
      transitionDuration={200}
      anchor={'right'}
      id='message-drawer'
      open={conference.messageDrawerOpen}
      variant='persistent'
      style={{ zIndex: 999 }}
    >
      <MessageGrid
        container
        direction='column'
        style={{ flexWrap: 'nowrap', height: 'calc(100vh - 85px)', overflow: 'hidden' }}
      >
        <Grid item container justifyContent='space-between' alignItems='center'>
          <Tabs
            TabIndicatorProps={{
              sx: {
                display: 'none',
              },
            }}
            value={value}
            onChange={handleChange}
            aria-label='messages and participant tabs'
          >
            <Tab
              disableRipple
              sx={{ color: '#000000 !important', p: 1, pl: 0 }}
              label={t('Messages')}
              {...a11yProps(0)}
            />
          </Tabs>
          <CloseDrawerButton />
        </Grid>
        <Grid
          item
          container
          justifyContent='space-between'
          alignItems='center'
          style={{ flex: '1 1 auto', overflowY: 'hidden' }}
        >
          <TabPanel value={value} index={0}>
            <TabGrid container sx={{ pb: 0 }} direction={'column'}>
              <MessagesTab messages={messages} />
            </TabGrid>
          </TabPanel>
        </Grid>
        <MessageInput onSendMessage={sendMessage} />
      </MessageGrid>
    </AntDrawer>
  );
});

export default MessageDrawer;
