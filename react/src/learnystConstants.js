export const LEARNYST_SOCKET_COMMANDS = {
  JOIN_ROOM: 1,
  LEAVE_ROOM: 2,
  SEND_MSG: 3,
  ONLINE_USER_COUNT: 4,
  ONLINE_USERS: 5,
  MSG_HISTORY: 6,
  UNREAD_MSG_COUNT: 7,
  ROOM_PARTICIPANTS: 8,
  DELETE_MSG: 9,
  MARK_MSG_READ: 10,
  HEART_BEAT: 11,
};

export const LEARNYST_SOCKET_NOTIFICATIONS = {
  USER_JOINED: 1,
  USER_LEFT: 2,
  NEW_MESSAGE: 3,
  USER_DISCONNECTED: 4,
  MSG_DELETED: 9,
  HAND_RAISED: 100,
  MIC_MUTED: 101,
  MIC_UNMUTED: 102,
  ADMIN_MUTED_MIC: 103,
  ADMIN_MUTED_ALL: 104,
  ADMIN_UNMUTED_MIC: 105,
  ADMIN_UNMUTED_ALL_MIC: 106,
  HAND_LOWERED: 107,
};

export const LEARNYST_ROOM_TYPE = {
  LIVE_CLASS_CHAT: 1,
  ONE_TO_ONE_CHAT: 2,
  COMMUNITY: 3,
  INAPP_NOTIFICATION: 4,
  LIVE_PAYMENT_DASHBOARD: 5,
  WHATS_APP_INBOX: 6,
};

export const LEARNYST_SOCKET_STATUS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
  CONNECTION_ERROR: "CONNECTION ERROR",
  JOINED_ROOM: "JOINED ROOM",
  ROOM_JOIN_ERROR: "ROOM JOIN ERROR"
}

export const SOCKET_HEART_BEAT_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const WEBINAR_END_BUFFER_TIME = 10 * 60 * 1000;  // 10 minutes

export const LIVE_CLASS_STATUS = {
  UPCOMING: 'upcoming', 
  LIVE: 'live', 
  COMPLETED: 'completed', 
  CANCELLED: 'cancelled', 
  EXPIRED: 'expired'
}

export const MESSAGE_TYPE = {
  TEXT: 1,
  EMOJI: 2
}