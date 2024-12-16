/* eslint-disable react-hooks/exhaustive-deps */
import VideoCard from "Components/Cards/VideoCard";
import React from "react";
import Footer from "Components/Footer/Footer";
import LayoutPinned from "./LayoutPinned";
import LayoutTiled from "./LayoutTiled";
import {ReactionBarSelector} from "@charkour/react-reactions";
import MuteParticipantDialog from "../Components/MuteParticipantDialog";
import {useTheme} from "@mui/material/styles";
import {t} from "i18next";
import {isComponentMode} from "../utils";
import BecomePublisherConfirmationDialog from "../Components/BecomePublisherConfirmationDialog";
import RecordingButton from "../Components/RecordingButton";

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
  const [gallerySize, setGallerySize] = React.useState({"w": 100, "h": 100});

  const theme = useTheme();

  React.useEffect(() => {
    handleGalleryResize(false);
  }, [props?.videoTrackAssignments, props?.allParticipants, props?.participantUpdated]);

  React.useEffect(() => {
    handleGalleryResize(true);
  }, [props?.messageDrawerOpen, props?.participantListDrawerOpen, props?.effectsDrawerOpen, props?.publisherRequestListDrawerOpen]);

  React.useEffect(() => {
    const debouncedHandleResize = debounce(handleGalleryResize, 500);
    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  //this trigger ReactionBarSelector to render everytime, useCallback by making sure about conference dependency - mekya
  function sendEmoji(emoji) {
    props?.sendReactions(emoji);
    props?.setShowEmojis(!props?.showEmojis);
  }

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
        if (props?.messageDrawerOpen || props?.participantListDrawerOpen || props?.effectsDrawerOpen || props?.publisherRequestListDrawerOpen) {
          gallery.classList.add("drawer-open");
        } else {
          gallery.classList.remove("drawer-open");
        }
      }
      const screenWidth = gallery.getBoundingClientRect().width;
      const screenHeight = gallery.getBoundingClientRect().height;

      setGallerySize({"w": screenWidth, "h": screenHeight});
    }
  }

  function getPinnedParticipant() {
    let firstPinnedParticipant;
    props.allParticipants = props?.allParticipants || {};
    Object.keys(props?.allParticipants).forEach(streamId => {
      let participant = props?.allParticipants[streamId];
      if (typeof participant.isPinned !== 'undefined'
        && participant.isPinned === true
        && typeof firstPinnedParticipant === 'undefined') {

        firstPinnedParticipant = props?.allParticipants[streamId];
        return firstPinnedParticipant;
      }
    });
    return firstPinnedParticipant;
  }

  const firstPinnedParticipant = getPinnedParticipant();

  const pinLayout = (typeof firstPinnedParticipant !== "undefined");

  return (
      <>
        {props?.isRecordPluginActive === true ?
            <RecordingButton/> : null
        }
        <MuteParticipantDialog
            isMuteParticipantDialogOpen={props?.isMuteParticipantDialogOpen}
            setMuteParticipantDialogOpen={(open)=>props?.setMuteParticipantDialogOpen(open)}
            participantIdMuted={props?.participantIdMuted}
            setParticipantIdMuted={(participant)=>props?.setParticipantIdMuted(participant)}
            turnOffYourMicNotification={(streamId)=>props?.turnOffYourMicNotification(streamId)}
        />
        <BecomePublisherConfirmationDialog/>
        {props?.audioTracks.map((audioTrackAssignment, index) => (
            <VideoCard
                key={index}
                trackAssignment={audioTrackAssignment}
                autoPlay
                name={""}
                style={{display: "none"}}
                talkers={props?.talkers}
                streamName={props?.streamName}
                isPublished={props?.isPublished}
                isPlayOnly={props?.isPlayOnly}
                isMyMicMuted={props?.isMyMicMuted}
                isMyCamTurnedOff={props?.isMyCamTurnedOff}
                allParticipants={props?.allParticipants}
                setAudioLevelListener={props?.setAudioLevelListener}
                setParticipantIdMuted={props?.setParticipantIdMuted}
                turnOnYourMicNotification={props?.turnOnYourMicNotification}
                turnOffYourMicNotification={props?.turnOffYourMicNotification}
                turnOffYourCamNotification={props?.turnOffYourCamNotification}
                pinVideo={props?.pinVideo}
                isAdmin={props?.isAdmin}
                publishStreamId={props?.publishStreamId}
                localVideo={props?.localVideo}
                localVideoCreate={props?.localVideoCreate}
            />
        ))}
        <div id="meeting-gallery" style={{height: "calc(100vh - 80px)"}}>
          {pinLayout ?
              (<LayoutPinned
                  pinnedParticipant={firstPinnedParticipant}
                  width={gallerySize.w}
                  height={gallerySize.h}
                  globals={props?.globals}
                  publishStreamId={props?.publishStreamId}
                  pinVideo={props?.pinVideo}
                  allParticipants={props?.allParticipants}
                  videoTrackAssignments={props?.videoTrackAssignments}
                  updateMaxVideoTrackCount={props?.updateMaxVideoTrackCount}
              />)
              :
              (<LayoutTiled
                  width={gallerySize.w}
                  height={gallerySize.h}
                  videoTrackAssignments={props?.videoTrackAssignments}
                  participantUpdated={props?.participantUpdated}
                  allParticipants={props?.allParticipants}
                  globals={props?.globals}
                  updateMaxVideoTrackCount={props?.updateMaxVideoTrackCount}
                  publishStreamId={props?.publishStreamId}
              />)
          }
        </div>

        {props?.showEmojis && (
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
        <Footer
            isPlayOnly={props?.isPlayOnly}
            isRecordPluginActive={props?.isRecordPluginActive}
            isEnterDirectly={props?.isEnterDirectly}
            isMyCamTurnedOff={props?.isMyCamTurnedOff}
            cameraButtonDisabled={props?.cameraButtonDisabled}
            checkAndTurnOffLocalCamera={props?.checkAndTurnOffLocalCamera}
            checkAndTurnOnLocalCamera={props?.checkAndTurnOnLocalCamera}
            isMyMicMuted={props?.isMyMicMuted}
            toggleMic={props?.toggleMic}
            microphoneButtonDisabled={props?.microphoneButtonDisabled}
            isScreenShared={props?.isScreenShared}
            handleStartScreenShare={props?.handleStartScreenShare}
            handleStopScreenShare={props?.handleStopScreenShare}
            showEmojis={props?.showEmojis}
            setShowEmojis={props?.setShowEmojis}
            numberOfUnReadMessages={props?.numberOfUnReadMessages}
            toggleSetNumberOfUnreadMessages={props?.toggleSetNumberOfUnreadMessages}
            messageDrawerOpen={props?.messageDrawerOpen}
            handleMessageDrawerOpen={props?.handleMessageDrawerOpen}
            participantCount={props?.participantCount}
            participantListDrawerOpen={props?.participantListDrawerOpen}
            handleParticipantListOpen={props?.handleParticipantListOpen}
            requestSpeakerList={props?.requestSpeakerList}
            publisherRequestListDrawerOpen={props?.publisherRequestListDrawerOpen}
            handlePublisherRequestListOpen={props?.handlePublisherRequestListOpen}
            handlePublisherRequest={props?.handlePublisherRequest}
            setLeftTheRoom={props?.setLeftTheRoom}
            addFakeParticipant={props?.addFakeParticipant}
            removeFakeParticipant={props?.removeFakeParticipant}
            fakeReconnect={props?.fakeReconnect}
            isBroadcasting={props?.isBroadcasting}
            handleSetDesiredTileCount={props?.handleSetDesiredTileCount}
            allParticipants={props?.allParticipants}
            pinVideo={props?.pinVideo}
        />
      </>
  );
});

export default MeetingRoom;
