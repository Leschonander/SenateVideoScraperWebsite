import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';

import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { paddingTop: theme.spacing(2) },
    colorSpan: {
      textDecorationLine: 'underline',
    },
  })
);

export default function HearingDashboard() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const url =
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv';

  React.useEffect(() => {
    d3.csv(url).then((d) => {
      let d_cleaned = d.map((c: any) => ({ ...c, Witnesses: eval(c['Witnesses']) }));
      console.log(d_cleaned);
      setData(d_cleaned);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  let counts = data.reduce((p, d) => {
    let year = new Date(d.Date).getFullYear();
    if (!p.hasOwnProperty(year)) {
      if (year !== 342) {
        p[year] = 0;
      }
    }
    if (year !== 342) {
      p[year]++;
    }
    delete p[NaN];
    return p;
  }, {});

  counts = Object.keys(counts).map((key: any) => ({ key: key, value: counts[key] }));
  const accessors = {
    xAccessor: (d) => d.key,
    yAccessor: (d) => d.value,
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <p>
            There have been <span className={classes.colorSpan}>{loading === false ? data.length : '?'}</span> hearings
            collected so far.
          </p>

          <p>
            This service exists because surprisingly, the Senate does not have a central repository for the hearings. In
            response to this, I built up a scraper to scrape said hearings and aggergate this data. You can find this{' '}
            <a href="https://github.com/Leschonander/SenateVideoScraper">here</a>. There you can look at the code, see
            the various csv's for the a given a committee.
          </p>

          <p>
            To actually use this service, you can use the search bar contained in the table to search for a specific
            hearing. You can also go to the bottom of the page and flip between pages as well.
          </p>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom variant="h6" align="center">
            Hearings per Year
          </Typography>
          <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
            <AnimatedAxis orientation="bottom" />
            <AnimatedAxis orientation="left" />
            <AnimatedLineSeries dataKey="Hearings per year" data={counts} {...accessors} />
            <Tooltip
              snapTooltipToDatumX
              snapTooltipToDatumY
              showVerticalCrosshair
              showSeriesGlyphs
              renderTooltip={({ tooltipData, colorScale }) => (
                <div>
                  <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>{tooltipData.nearestDatum.key}</div>
                  {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                  {', '}
                  {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                </div>
              )}
            />
          </XYChart>
        </Grid>
      </Grid>
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
        </div>
      )}
    </div>
  );
}
