export const safeParseJSON = (inputString, isEncoded = false) => {
  if (!inputString) {
    return null;
  }
  try {
    const jsonString = isEncoded ? decodeURIComponent(inputString) : inputString;
    return JSON.parse(jsonString);
  } catch {
    return;
  }
};


export function getRoomId() {
  return document.getElementById("root")?.getAttribute("data-room-name");
}

export function getSchoolDetails() {
  let schoolData =  document.getElementById("root")?.getAttribute("data-school-data");
  return schoolData ? safeParseJSON(schoolData) : {}
}

export function getLearnystSocketEndPoint () {
  return document.getElementById("root")?.getAttribute("data-learnyst-socket-endpoint");
}

export function getUserAuthToken () {
  return document.getElementById("root")?.getAttribute("data-user-auth-token");
}

export function getSessionConfigData () {
  let sessionCongifData = document.getElementById("root")?.getAttribute("data-session-config-data");
  return sessionCongifData ? sessionCongifData : '{}'
}

export function roomJoineeName() {
  return (document.getElementById("root")?.getAttribute("data-participant-name")) || "Akash";
}

export const endLiveWebinar = () => {
  const {liveLessonId} = safeParseJSON(getSessionConfigData())
  const url = `https://api.learnyst.com/admin/v5/live_lessons/${liveLessonId}`;
  const data = {
      status : "completed"
  };
  
  fetch(url, {
      method: 'PATCH', 
      headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getUserAuthToken()}`
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log('Success:', data); 
  })
  .catch(error => {
      console.error('Error:', error);
  });
}