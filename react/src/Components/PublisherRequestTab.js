import React, {useContext} from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { SvgIcon } from "./SvgIcon";
import {ConferenceContext} from "../pages/AntMedia";

const PublisherRequestName = styled(Typography)(({ theme }) => ({
    color: "#000",
    fontWeight: 500,
    fontSize: 14,
}));
//hover color of allow or deny
const PinBtn = styled(Button)(({ theme }) => ({
    "&:hover": {
        backgroundColor: theme.palette.themeColor[50],
        color: "#fff",
    },
}));

function PublisherRequestTab(props) {
    const conference = useContext(ConferenceContext);

    const getPublisherRequestItem = (videoId) => {
        return (
            <Grid
                key={videoId}
                container
                alignItems="center"
                justifyContent="space-between"
                style={{ borderBottomWidth: 1 }}
                sx={{ borderColor: "primary.main" }}
            >
                <Grid item sx={{ pr: 1 }}>
                    <PublisherRequestName variant="body1">{videoId}</PublisherRequestName>
                </Grid>
                <Grid item>
                    <PinBtn
                        sx={{ minWidth: "unset", pt: 1, pb: 1 }}
                        onClick={() => {conference?.approveBecomeSpeakerRequest(videoId); conference?.setRequestSpeakerList(conference?.requestSpeakerList.filter((item) => item.streamId !== videoId))}}
                    >
                        Allow
                    </PinBtn>

                    <PinBtn
                        sx={{ minWidth: "unset", pt: 1, pb: 1 }}
                        onClick={() => {conference?.rejectSpeakerRequest(videoId); conference?.setRequestSpeakerList(conference?.requestSpeakerList.filter((item) => item.streamId !== videoId))}}
                    >
                        Deny
                    </PinBtn>

                </Grid>
            </Grid>
        );
    };
    return (
        <div style={{width: "100%", overflowY: "auto"}}>
            <Stack sx={{width: "100%",}} spacing={2}>
                <Grid container>
                    <SvgIcon size={28} name="participants" color="#000"/>
                    <PublisherRequestName
                        variant="body2"
                        style={{marginLeft: 8, fontWeight: 500}}
                    >
                        {conference?.requestSpeakerList.length}
                    </PublisherRequestName>
                </Grid>
                {conference?.requestSpeakerList.map((streamId) => {
                    if (conference?.publishStreamId !== streamId) {
                        return getPublisherRequestItem(streamId);
                    } else {
                        return "";
                    }
                })}
            </Stack>
        </div>
    );

}

export default PublisherRequestTab;
