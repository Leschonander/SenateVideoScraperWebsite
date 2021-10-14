import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';
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
  const committee = router.query.slug;
  const date_format = d3.timeParse('%m/%d/%y');

  React.useEffect(() => {
    d3.csv(
      'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
    ).then((data) => {
      data = data.filter((d) => d.Committee === 'Enviroment');
      data = data.map((d) => ({ ...d, Year: date_format(d['Date']).getFullYear() }));
      console.log(data);
      setData(data);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  const hearingCount = data.length;

  const rollup = d3.rollups(
    data,
    (v) => v.length,
    (d) => d.Year
  );
  const hearingsPerYear = Array.from(rollup, ([key, value]) => ({ key, value })).reverse();
  console.log(hearingsPerYear);
  const accessors = {
    xAccessor: (d) => d.key,
    yAccessor: (d) => d.value,
  };
  // <AnimatedLineSeries dataKey="Line 1" data={hearingsPerYear} {...accessors} />

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" align="center">
        {committee}
      </Typography>
      {loading && <div>Senate Committee Hearing data loading...</div>}
      {!loading && (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography gutterBottom variant="h6" align="center">
                Total Hearings
                <br />
                {hearingCount}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography gutterBottom variant="h6" align="center">
                <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
                  <AnimatedAxis orientation="bottom" />
                  <AnimatedAxis orientation="left" />
                  <AnimatedLineSeries dataKey="Line 1" data={hearingsPerYear} {...accessors} />
                  <Tooltip
                    snapTooltipToDatumX
                    snapTooltipToDatumY
                    showVerticalCrosshair
                    showSeriesGlyphs
                    renderTooltip={({ tooltipData, colorScale }) => (
                      <div>
                        <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
                          {tooltipData.nearestDatum.key}
                        </div>
                        {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                        {', '}
                        {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                      </div>
                    )}
                  />
                </XYChart>
              </Typography>
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
