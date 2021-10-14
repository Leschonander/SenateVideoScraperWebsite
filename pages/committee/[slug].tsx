import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { pid } = router.query;

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
      {!loading && <div>Data loaded!</div>}
    </div>
  );
}
