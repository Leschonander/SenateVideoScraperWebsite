import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';

import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { paddingTop: theme.spacing(2) },
    amount: { margin: theme.spacing(1) },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  })
);

export default function HearingDashboard() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    d3.csv(
      'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
    ).then((d) => {
      console.log(d);
      setData(d);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" align="center">
        Welcome back
      </Typography>
      {loading && <div>Senate Committee Hearing data loading...</div>}
      {!loading && (
        <div>
          <MaterialTable
            columns={[
              { title: 'Date', field: 'Date' },
              { title: 'Time', field: 'Time' },
              { title: 'URL', field: 'URL' },
              { title: 'Title', field: 'Title' },
              { title: 'Location', field: 'Location' },
              { title: 'Committee', field: 'Committee' },
              { title: 'Video Url', field: 'video_url' },
            ]}
            data={data}
            title="Senate Committee Hearings"
            options={{
              exportAllData: true,
              exportButton: {
                csv: true,
              },
              fontSize: 12,
            }}
          />
        </div>
      )}
    </div>
  );
}
