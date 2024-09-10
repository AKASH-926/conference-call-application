import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { Grid, Tabs, Tab, IconButton, Button } from '@mui/material';
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
import PopoutIcon from '@mui/icons-material/OpenInNew'; // Icon for pop-out button
import { isMobile, isTablet } from 'react-device-detect';
import { SvgComponent } from 'learnystIcons';

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

const ResizeHandle = styled('div')(({ position }) => ({
  width: position === 'left' || position === 'right' ? '8px' : '100%',
  height: position === 'top' || position === 'bottom' ? '8px' : '100%',
  backgroundColor: '#ccc',
  position: 'absolute',
  left: position === 'left' ? 0 : 'auto',
  right: position === 'right' ? 0 : 'auto',
  top: position === 'top' ? 0 : 'auto',
  bottom: position === 'bottom' ? 0 : 'auto',
  cursor: position === 'top' || position === 'bottom' ? 'ns-resize' : 'ew-resize',
}));

const MessageDrawer = React.memo((props) => {
  const [value, setValue] = React.useState(0);
  const [messages, setMessages] = React.useState([]);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false); // State for resizing
  const [resizePosition, setResizePosition] = React.useState(null); // State for resize handle position
  const [drawerSize, setDrawerSize] = React.useState({ width: 400, height: 600 }); // Initial size
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
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
    handleSocketActions(actionData, (response) => {
      console.log('response', response);
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

  const handleMouseDown = (event) => {
    if (!conference?.isDrawerScreenPopout) return; // Only allow dragging in pop-out mode
    setDragging(true);
    setDragStart({ x: event.clientX - position.x, y: event.clientY - position.y });
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const elementWidth = drawerSize.width;
      const elementHeight = drawerSize.height;
      const minX = 0;
      const minY = 0;
      const maxX = viewportWidth - elementWidth;
      const maxY = viewportHeight - elementHeight;
      const newX = event.clientX - dragStart.x;
      const newY = event.clientY - dragStart.y;
  
      const clampedX = Math.max(minX, Math.min(newX, maxX));
      const clampedY = Math.max(minY, Math.min(newY, maxY));
  
      setPosition({
        x: clampedX,
        y: clampedY,
      });
    }
  
    if (resizing) {
      if (resizePosition === 'right') {
        const newWidth = Math.max(300, event.clientX - position.x);
        setDrawerSize((prevSize) => ({
          width: newWidth,
          height: prevSize.height,
        }));
      } else if (resizePosition === 'bottom') {
        const newHeight = Math.max(100, event.clientY - position.y);
        setDrawerSize((prevSize) => ({
          width: prevSize.width,
          height: newHeight,
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false); // Stop resizing
  };

  const handleResizeMouseDown = (position) => (event) => {
    setResizePosition(position);
    setResizing(true);
    event.stopPropagation();
  };

  const togglePopout = () => {
    conference.setIsDrawerScreenPopout(!conference?.isDrawerScreenPopout)
    if (!conference?.isDrawerScreenPopout) {
      // Reset position when popping back in
      const viewportWidth = window.innerWidth;
      setPosition({ x: viewportWidth - drawerSize.width - 0, y: 0 });
      setDrawerSize({ width: 400, height: 600 }); // Reset size when docking back
    }
  };

  React.useEffect(() => {
    if (conference?.isDrawerScreenPopout && !isMobile && !isTablet) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [conference?.isDrawerScreenPopout, dragging, resizing]);

  return conference?.isDrawerScreenPopout ? (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${drawerSize.width}px`,
        height: `${drawerSize.height}px`,
        backgroundColor: 'white',
        zIndex: 9999,
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80px',
        minWidth: '300px'
      }}
    >
      <MessageGrid
        container
        direction="column"
        style={{ flexWrap: 'nowrap', height: 'calc(100% - 20px)', overflow: 'hidden' }} // Adjusted height to account for resize handles
      >
        <Grid item container justifyContent="space-between" alignItems="center" onMouseDown={handleMouseDown} sx={{cursor: 'move'}}>
          <Tabs
            TabIndicatorProps={{
              sx: {
                display: 'none',
              },
            }}
            value={value}
            onChange={handleChange}
            aria-label="messages and participant tabs"
          >
            <Tab
              disableRipple
              sx={{ color: '#000000 !important', p: 1, pl: 0 }}
              label={t('Messages')}
              {...a11yProps(0)}
            />
          </Tabs>
          <Grid sx={{ display: 'flex' }}>
            <IconButton
              onClick={togglePopout}
              title={conference?.isDrawerScreenPopout ? 'Dock Back' : 'Pop Out'}
            >
              <PopoutIcon fontSize='small' sx={{ color: '#000000' }} />
            </IconButton>
            <Button sx={{ minWidth: 30 }} onClick={() => {conference?.setIsDrawerScreenPopout(false)}}>
             <SvgComponent name="close" width="18px" height="18px" fill={"#000000"}/>
             </Button>
          </Grid>
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
        <Grid sx={{height: '10px' ,cursor: 'move'}}onMouseDown={handleMouseDown} ></Grid>
      </MessageGrid>
      <ResizeHandle position='bottom' onMouseDown={handleResizeMouseDown('bottom')} />
      <ResizeHandle position='right' onMouseDown={handleResizeMouseDown('right')} />
    </div>
  ) : (
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
          <Grid>
            {!isMobile && !isTablet ? (
              <IconButton
                onClick={togglePopout}
                title={conference?.isDrawerScreenPopout ? 'Dock Back' : 'Pop Out'}
              >
                <PopoutIcon fontSize='small' sx={{ color: '#000000' }} />
              </IconButton>
            ) : null}
            <CloseDrawerButton />
          </Grid>
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
