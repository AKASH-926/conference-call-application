/* eslint-disable react-hooks/exhaustive-deps */
import VideoCard from "Components/Cards/VideoCard";
import React from "react";
import Footer from "Components/Footer/Footer";
import {ConferenceContext} from "./AntMedia";
import LayoutPinned from "./LayoutPinned";
import LayoutTiled from "./LayoutTiled";
import {ReactionBarSelector} from "@charkour/react-reactions";
import MuteParticipantDialog from "../Components/MuteParticipantDialog";
import {useTheme} from "@mui/material/styles";
import {t} from "i18next";
import {isComponentMode} from "../utils";
import { isMobile, isTablet } from "react-device-detect";
import { LEARNYST_ROOM_TYPE, LEARNYST_SOCKET_COMMANDS, MESSAGE_TYPE } from "learnystConstants";
import { handleSocketActions } from "LearnystUtils/socketUtils";


function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}


const MeetingRoom = React.memo((props) => {
  const conference = React.useContext(ConferenceContext)
  const [gallerySize, setGallerySize] = React.useState({"w": 100, "h": 100});

  const theme = useTheme();

  const [footerVisible, setFooterVisible] = React.useState(true);
  const [isFooterFocused, setIsFooterFocused] = React.useState(false);
  const footerBlurTimeout = React.useRef(null);

  React.useEffect(() => {
    handleGalleryResize(false);
    window.conference = conference;
  }, [conference.videoTrackAssignments, conference.participantUpdated]);

  React.useEffect(() => {
    handleGalleryResize(true);
  }, [conference.messageDrawerOpen, conference.participantListDrawerOpen, conference.effectsDrawerOpen, conference.isDrawerScreenPopout]);

  React.useEffect(() => {
    const debouncedHandleResize = debounce(handleGalleryResize, 500);
    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  // React.useEffect(() => {
  //   document.addEventListener("mousemove", handleMouseMove);
  //   return () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  function sendEmoji(emoji) {
    // conference?.sendReactions(emoji);
    sendLearnystEmoji(emoji);
    conference.setShowEmojis(!conference.showEmojis);
  }
  React.useEffect(() => {
    const emojiData = conference.learnystEmojiReaction || {}
    if(emojiData?.emoji?.length) {
      conference.learnystShowReactions(emojiData?.userName, emojiData?.emoji);
    }
}, [conference.learnystEmojiReaction]);

  const sendLearnystEmoji = (emoji) => {
    const actionData = {
      command: LEARNYST_SOCKET_COMMANDS.SEND_MSG,
      roomType: LEARNYST_ROOM_TYPE.LIVE_CLASS_CHAT,
      message:  emoji,
      messageType: MESSAGE_TYPE.EMOJI // for emoji
    };
    conference.learnystShowReactions("You", emoji)
    handleSocketActions(actionData, (respone) => {
      console.log('response', respone);
    });
  };

  const reactionList = [
    {label: t("Love It"), node: <div>💖</div>, key: "sparkling_heart"},
    {label: t("Like"), node: <div>👍🏼</div>, key: "thumbs_up"},
    {label: t("Tada"), node: <div>🎉</div>, key: "party_popper"},
    {label: t("Applause"), node: <div>👏🏼</div>, key: "clapping_hands"},
    {label: t("Haha"), node: <div>😂</div>, key: "face_with_tears_of_joy"},
    {label: t("Surprised"), node: <div>😮</div>, key: "open_mouth"},
    {label: t("Sad"), node: <div>😢</div>, key: "sad_face"},
    {label: t("Thinking"), node: <div>🤔</div>, key: "thinking_face"},
    {label: t("Dislike"), node: <div>👎🏼</div>, key: "thumbs_down"}
  ];

  function handleGalleryResize(calcDrawer) {

    const gallery = document.getElementById("meeting-gallery");

    if (gallery) {
      if (calcDrawer) {
        if (conference.messageDrawerOpen || conference.participantListDrawerOpen || conference.effectsDrawerOpen) {
          gallery.classList.add("drawer-open");
        } else {
          gallery.classList.remove("drawer-open");
        }
      }
      if(conference.isDrawerScreenPopout){
        gallery.classList.remove("drawer-open");
      }
      const screenWidth = gallery.getBoundingClientRect().width;
      const screenHeight = gallery.getBoundingClientRect().height;

      setGallerySize({"w": screenWidth, "h": screenHeight});
    }
  }

  function getPinnedParticipant() {
    let firstPinnedParticipant;
    conference.allParticipants = conference.allParticipants || {};
    Object.keys(conference.allParticipants).forEach(streamId => {
      let participant = conference.allParticipants[streamId];
      if (typeof participant.isPinned !== 'undefined'
        && participant.isPinned === true
        && typeof firstPinnedParticipant === 'undefined') {

        firstPinnedParticipant = conference.allParticipants[streamId];
        return firstPinnedParticipant;
      }
    });
    return firstPinnedParticipant;
  }

  const firstPinnedParticipant = getPinnedParticipant();

  const pinLayout = (typeof firstPinnedParticipant !== "undefined") && !isMobile && !isTablet

  function handleMouseMove() {
    setFooterVisible(true); 
    clearTimeout(footerBlurTimeout.current);
    footerBlurTimeout.current = setTimeout(() => {
      if (isFooterFocused === false) {
        setFooterVisible(false);
      }
    }, 5000);
  }

  function handleFooterMouseEnter() {
    setIsFooterFocused(true);
    setFooterVisible(true);
    clearTimeout(footerBlurTimeout.current);
  }

  function handleFooterMouseLeave() {
    setIsFooterFocused(false);
    handleMouseMove();
  }

  return (
    <>
      <MuteParticipantDialog/>
      {conference.audioTracks.map((audioTrackAssignment, index) => (
        <VideoCard
          key={index}
          trackAssignment={audioTrackAssignment}
          autoPlay
          name={""}
          style={{display: "none"}}
        />
      ))}
      <div id="meeting-gallery" style={{height: conference.isFullScreen ? "100vh" : "calc(100vh - 60px)"}}>
        <>
          {pinLayout ?
            (<LayoutPinned
              pinnedParticipant={firstPinnedParticipant}
              width={gallerySize.w}
              height={gallerySize.h}
            />)
            :
            (<LayoutTiled
              width={gallerySize.w}
              height={gallerySize.h}
            />)
          }
        </>
      </div>

      {conference.showEmojis && (
        <div id="meeting-reactions" style={{
          position: isComponentMode() ? "absolute" : "fixed",
          bottom: 80,
          display: "flex",
          alignItems: "center",
          padding: 16,
          zIndex: 666,
          height: 46,
        }}>
          <ReactionBarSelector reactions={reactionList} iconSize={28}
                               style={{backgroundColor: theme.palette.themeColor[70]}} onSelect={sendEmoji}/>
        </div>)
      }
      <div
        // onMouseEnter={handleFooterMouseEnter}
        // onMouseLeave={handleFooterMouseLeave}  // auto hide footer code
        style={{
          opacity: !conference.isFullScreen ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          zIndex: !conference.isFullScreen  ? theme.zIndex.drawer + 1 : theme.zIndex.drawer - 1,
          zIndex: theme.zIndex.drawer + 1 
        }}
      >
        <Footer {...props} />
      </div>

    </>
  )
});

export default MeetingRoom;
