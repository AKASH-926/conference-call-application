import React, { useCallback, useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { Grid, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ParticipantTab from './ParticipantTab';
import CloseDrawerButton from '../DrawerButton';
import { ConferenceContext } from 'pages/AntMedia';
import { getAntDrawerStyle } from 'styles/themeUtil';

const AntDrawer = styled(Drawer)(({ theme }) => getAntDrawerStyle(theme));

const ParticipantListGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  padding: 16,
  background: theme.palette.themeColor[0],
  borderRadius: 10
}));

const TabGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  paddingBottom: 16,
  paddingTop: 16,
  flexWrap: 'nowrap',
}));

const ParticipantListDrawer = React.memo(props => {
  const [value, setValue] = React.useState(0);
  const conference = useContext(ConferenceContext);
  const { t } = useTranslation();

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const TabPanel = useCallback((props) => {
    const { children, value, index, ...other } = props;

  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`drawer-tabpanel-${index}`}
        aria-labelledby={`drawer-tab-${index}`}
        {...other}
        style={{height: '100%', width: '100%' }}
      >
        {value === index && children}
      </div>
    );
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
      id="message-drawer"
      open={conference.participantListDrawerOpen}
      variant="persistent"
      style={{ zIndex: 999 }}
    >
      <ParticipantListGrid
        container
        direction="column"
        style={{ flexWrap: 'nowrap',  height: 'calc(100vh - 85px)', overflow: 'hidden' }}
      >
        <Grid item container justifyContent="space-between" alignItems="center">
          <Tabs
            TabIndicatorProps={{
              sx: {
                display: 'none',
              },
            }}
            value={value}
            onChange={handleChange}
            aria-label="participant tab"
          >
            <Tab disableRipple sx={{ color: '#000000 !important', p: 1, pl: 0 }} label={t('Participants')} {...a11yProps(0)} />
          </Tabs>
          <CloseDrawerButton />
        </Grid>
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ flex: '1 1 auto', overflowY: 'hidden' }}
        >
          <TabPanel value={value} index={0}>
            <TabGrid container>
              <ParticipantTab
                participantCount={conference?.learnystParticipantList?.length || 0}
                participantList={conference?.learnystParticipantList}
                conference={conference}
              />
            </TabGrid>
          </TabPanel>
        </Grid>
      </ParticipantListGrid>
    </AntDrawer>
  );
});

export default ParticipantListDrawer;
