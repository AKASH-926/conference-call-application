import { LEARNYST_ROOM_TYPE, LEARNYST_SOCKET_COMMANDS, LEARNYST_SOCKET_NOTIFICATIONS, LEARNYST_SOCKET_STATUS } from 'learnystConstants';
import { io } from 'socket.io-client';
import { getLearnystSocketEndPoint, getRoomId, getSchoolDetails, getUserAuthToken } from './commonUtils';
import { getUrlParameter } from '@sridhardvvce/webrtc_adaptor';

let socket = null;

function getIsPlayOnly() {
  const dataIsPlayOnly = document.getElementById("root")?.getAttribute("data-is-play-only");
  return (dataIsPlayOnly) ? dataIsPlayOnly : getUrlParameter("playOnly");
}

const isPlayOnly = Boolean(getIsPlayOnly())

const connectSocket = () => {
  let isUserDisconnected = false
  if (!socket) {
    const socketEndPoint = getLearnystSocketEndPoint()
    const authToken = getUserAuthToken()
    socket = io(socketEndPoint ?? 'https://rooms.learnyst.com', {
      transports: ['websocket', 'polling'],
      reconnection: true, // This is true by default
      reconnectionAttempts: Infinity, // Number of reconnection attempts before giving up
      reconnectionDelay: 3000, // Delay between reconnection attempts
      reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
      timeout: 20000, // Connection timeout before giving up
      auth: {
        token:
        authToken ?? 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjc5MzA0MTcsInNpZCI6MTUyNDMyLCJleHAiOjE3MjMyMTY2OTYsInR5cCI6NCwibG9rIjoiMDAwMCIsInRvayI6Ikd6RmROanIwWGpJR2Q1bUEwUlBNWkEiLCJ0aW1lIjoxNzIzMTg3ODk2fQ.iDU_DY39bobnu__DIV2sWTJqxQKHKAdbAAGU8R5dijw',
        envType: 'test',
      }
    });

    socket.on('connect', () => {
      console.log('Connected to server learnyst', socket.id);
      if(isUserDisconnected) {
        isUserDisconnected = false
        joinLearnystRoom()
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server',reason);
      if (reason === 'io server disconnect') {
        socket.connect();
    }
      if(!isUserDisconnected){
        console.log('Disconnected from server inside');
        isUserDisconnected = true
      }
    });

    socket.on('error', (error) => {
      console.error('Error received from server:', error);
    });

    socket.on('connect_error', (err) => {
      console.log('Connect Error:', err);
      if (err.message.startsWith('Authentication failed')) {
        console.log('Authentication failed. Handle auth error here');
      }
    });

    socket.on('reconnect', () => {
      console.log('Reconnected to server');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });
  }
  return socket;
};

const subscribeToEvent = (event, callback) => {
  if (!socket) {
    console.error('Socket is not initialized. Call connectSocket first.');
    return;
  }
  socket.on(event, callback);
};

const handleSocketActions = (actionData, callback) => {
  if (!socket) {
    console.error('Socket is not initialized. Call connectSocket first.');
    return;
  }
  const roomId = Number(getRoomId());
  const schoolData = getSchoolDetails();
  const { schoolId, userId, userName } = schoolData;
  const commandData = {
    command: actionData?.command,
    school_id: schoolId || 152432,
    user_data: {
      user_id: userId || 7930417,
      user_name: isPlayOnly ? userName || "Deadpool" : `${userName} (Host)`
    },
    room_data: {
      room_type: actionData?.roomType || 1,
      room_id: roomId || 2228487,
    },
    ...(actionData?.command === LEARNYST_SOCKET_NOTIFICATIONS.NEW_MESSAGE
      ? {
          command_data: {
            msg_id: new Date().getTime(),
            msg: {
              type: actionData?.messageType,
              text: actionData?.message,
            },
          },
        }
      : {}),
  };
  socket.timeout(5000).emit('command', commandData, (err, response) => {
    if (err) {
      console.error('Socket action failed',err);
    } else {
      console.log('=====>commandData',commandData,response);
      callback(response)
    }
  });
};

const joinLearnystRoom = () => {
  const actionData = {
    command: LEARNYST_SOCKET_COMMANDS.JOIN_ROOM,
    roomType: LEARNYST_ROOM_TYPE.LIVE_CLASS_CHAT,
  };
  handleSocketActions(actionData, (respone) => {
    console.log('response joined room', respone);
  });
}

const leaveLearnystRoom = () => {
  const actionData = {
    command: LEARNYST_SOCKET_COMMANDS.LEAVE_ROOM,
    roomType: LEARNYST_ROOM_TYPE.LIVE_CLASS_CHAT,
  };
  handleSocketActions(actionData, (respone) => {
    console.log('response', respone);
  });
}


const unsubscribeFromEvent = (event, callback) => {
  if (!socket) {
    console.error('Socket is not initialized. Call connectSocket first.');
    return;
  }
  socket.off(event, callback);
};

const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};


  const sendHeartBeatToRoom = () => {
  const actionData = {
    command: LEARNYST_SOCKET_COMMANDS.HEART_BEAT,
    roomType: LEARNYST_ROOM_TYPE.LIVE_CLASS_CHAT
  }
  handleSocketActions(actionData, (respone) => {});
 }

export {
  connectSocket,
  subscribeToEvent,
  unsubscribeFromEvent,
  disconnectSocket,
  handleSocketActions,
  joinLearnystRoom,
  leaveLearnystRoom,
  sendHeartBeatToRoom
};
