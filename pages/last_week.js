import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import Grid from '@material-ui/core/Grid';

import React from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { paddingTop: theme.spacing(2) },
    card: {
      backgroundColor: 'ghostwhite',
      backgroundClip: 'content-box',
      boxShadow: '0px 4px 35px ghostwhite',
      borderRadius: '6px',
      border: '1px solid ghostwhite',
    },
  })
);

export async function getServerSideProps(context) {
  let sevenDays = new Date();
  sevenDays.setDate(sevenDays.getDate() - 7);
  console.log(sevenDays);
  let parseDate = d3.timeFormat('%m/%d/%Y');
  let csv_data = await d3.csv(
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
  );

  csv_data = csv_data.filter(function (d) {
    return new Date(d.Date) > sevenDays;
  });
  csv_data = csv_data.map((c) => ({ ...c, Witnesses: eval(c['Witnesses']) }));

  return {
    props: { data: csv_data, total_rows: csv_data.length },
  };
}

export default function LastWeekDashboard(props) {
  const classes = useStyles();

  const [data, setData] = React.useState(props.data);
  const [loading, setLoading] = React.useState(false);

  const rollup = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.Committee
  );

  const hearingsPerCommittee = Array.from(rollup, ([key, value]) => ({ key, value })).reverse();

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" align="center">
        Congress last week
      </Typography>
      {loading && <div>Senate Committee Hearing data loading...</div>}
      {!loading && (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} className={classes.card}>
              <Typography gutterBottom variant="h6" align="center">
                Total Hearings this week
                <br />
                {props.total_rows}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} className={classes.card}>
              <MaterialTable
                columns={[
                  { title: 'Committee', field: 'key' },
                  { title: 'Count', field: 'value' },
                ]}
                data={hearingsPerCommittee}
                title="Senate Committee Hearings Count per Committee"
                options={{
                  exportAllData: true,
                  exportButton: {
                    csv: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <MaterialTable
                columns={[
                  { title: 'Date', field: 'Date' },
                  { title: 'Time', field: 'Time' },
                  { title: 'URL', field: 'URL' },
                  { title: 'Title', field: 'Title' },
                  { title: 'Location', field: 'Location' },
                  { title: 'Committee', field: 'Committee' },
                  { title: 'Video Url', field: 'video_url' },
                  { title: 'Witnesses', field: 'Witnesses' },
                ]}
                data={data}
                title="Senate Committee Hearings"
                options={{
                  exportAllData: true,
                  exportButton: {
                    csv: true,
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
