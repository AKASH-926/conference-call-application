import React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SvgComponent } from 'learnystIcons';
import { Box, useTheme } from '@mui/material';
import { ConferenceContext } from 'pages/AntMedia';

const ParticipantName = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 500,
  fontSize: 14,
}));

function ParticipantTab(props) {
  const theme = useTheme();
  const conference = React.useContext(ConferenceContext);
  const enableParticipantList =
    Boolean(conference?.sessionConfigData?.enableParticipantList) || false;

  function keepElementAtFirstIndex(array, element) {
    if (array.length === 0 || array[0] === element || element === undefined || element === null) {
      return array;
    }
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
    array.unshift(element);
    return array;
  }

  const participantList = props?.participantList || [];

  let hostName = participantList.find((item) => item?.user_name?.includes('Host'));

  const memoizedList = React.useMemo(() => {
    let modifiedParticipantsList = keepElementAtFirstIndex(
      participantList.filter((item) => item !== null && item !== undefined),
      hostName
    );

    return (
      <>
        {modifiedParticipantsList.map((item) => {
          return (
            <Grid
              id={'participant-item-' + item?.user_id}
              key={item?.user_id}
              container
              alignItems='center'
              justifyContent='space-between'
              style={{ borderBottomWidth: 1 }}
              sx={{ borderColor: 'primary.main', alignContent: 'center' }}
            >
              <Grid item sx={{ pr: 1, display: 'flex', gap: '10px' }}>
                <Box
                  sx={{
                    width: '25px',
                    height: '25px',
                    background: '#0476D0',
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}
                >
                  <Typography variant='caption' sx={{ textTransform: 'uppercase' }}>
                    {item?.user_name?.[0]}
                  </Typography>
                </Box>
                <ParticipantName variant='button' sx={{ textTransform: 'capitalize' }}>
                  {item?.user_name}
                </ParticipantName>
              </Grid>
            </Grid>
          );
        })}
      </>
    );
  }, [participantList]);

  return (
    <div style={{ width: '100%', overflowY: 'auto' }}>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Grid container>
          <SvgComponent
            name='participants'
            width='22px'
            height='22px'
            fill={theme.palette.themeColor[80]}
          />
          {!props?.conference?.isPlayOnly && (
            <ParticipantName variant='body2' style={{ marginLeft: 4, fontWeight: 500 }}>
              {props?.participantCount}
            </ParticipantName>
          )}
        </Grid>
        {!enableParticipantList && conference?.isPlayOnly ? (
          <Grid
            id={'participant-item-host'}
            container
            alignItems='center'
            justifyContent='space-between'
            style={{ borderBottomWidth: 1 }}
            sx={{ borderColor: 'primary.main', alignContent: 'center' }}
          >
            <Grid item sx={{ pr: 1, display: 'flex', gap: '10px' }}>
              <Box
                sx={{
                  width: '25px',
                  height: '25px',
                  background: !hostName?.user_name ? 'unset' : '#0476D0',
                  borderRadius: '50%',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Typography variant='caption' sx={{ textTransform: 'uppercase' }}>
                  {hostName?.user_name[0]}
                </Typography>
              </Box>
              <ParticipantName variant='button' sx={{ textTransform: 'capitalize' }}>
                {hostName?.user_name}
              </ParticipantName>
            </Grid>
          </Grid>
        ) : (
          memoizedList
        )}
      </Stack>
    </div>
  );
}

export default ParticipantTab;
