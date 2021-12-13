import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { useRouter } from 'next/router';

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
  const committee = context.query.slug;
  console.log(committee);
  let csv_data = await d3.csv(
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
  );
  csv_data = csv_data.filter((d) => d.Committee === committee);
  csv_data = csv_data.map((c) => ({ ...c, Witnesses: eval(c['Witnesses']) }));

  csv_data = csv_data.map((item) => {
    if (Array.isArray(item.Witnesses)) {
      const updatedItem = {
        ...item,
        Witnesses: item.Witnesses.filter((v, i, a) => a.indexOf(v) === i)
          .join('\n')
          .replace('Chairman', '')
          .replace('Opening Statement', '')
          .replace('Ranking Member', '')
          .replace('opening statement', ''),
      };
      return updatedItem;
    } else if (item.Witnesses === undefined) {
      const updatedItemUndefined = {
        ...item,
        Witnesses: '',
      };
      return updatedItemUndefined;
    }
    return item;
  });

  return {
    props: { committee: committee, data: csv_data },
  };
}

export default function HearingDashboard(props) {
  const classes = useStyles();
  const date_format = d3.timeParse('%m/%d/%y');

  const [data, setData] = React.useState(
    props.data.map((d) => ({ ...d, Year: date_format(d['Date'])?.getFullYear() }))
  );
  const [dataMaster, setDataMaster] = React.useState(data);

  const [loading, setLoading] = React.useState(false);
  const [committee, updateCommittee] = React.useState(props.committee);
  const router = useRouter();

  const [yearsSelected, setYearsSelected] = React.useState([]);
  React.useEffect(() => {
    let NewData = dataMaster.map((d) => ({ ...d, Year: new Date(d.Date).getFullYear() }));
    if (!Array.isArray(yearsSelected) || !yearsSelected.length) {
      setData(dataMaster);
    } else {
      NewData = NewData.filter((d) => yearsSelected.includes(d.Year));
      setData(NewData);
    }
  }, [yearsSelected]);
  const years = Array(26)
    .fill(1996)
    .map((x, y) => x + y);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setYearsSelected(typeof value === 'string' ? value.split(',') : value);

    if (typeof value === 'string') {
      // console.log(value)
    } else {
      // console.log(value)
    }
  };

  const hearingCount = data.length;

  const rollup = d3.rollups(
    data,
    (v) => v.length,
    (d) => parseInt(d.Date.split('/')[2])
  );
  let hearingsPerYear = Array.from(rollup, ([key, value]) => ({ key, value })).reverse();
  hearingsPerYear = hearingsPerYear.sort((a, b) => a.key - b.key);
  const accessors = {
    xAccessor: (d) => d.key,
    yAccessor: (d) => d.value,
  };

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" align="center">
        {committee}
      </Typography>
      {loading && <div>Senate Committee Hearing data loading...</div>}
      {!loading && (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} className={classes.card}>
              <Typography gutterBottom variant="h6" align="center">
                Total Hearings
                <br />
                {hearingCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} className={classes.card}>
              <Typography gutterBottom variant="h6" align="center">
                Hearings per Year
              </Typography>
              <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
                <AnimatedAxis orientation="bottom" />
                <AnimatedAxis orientation="left" />
                <AnimatedLineSeries dataKey="Hearings per year" data={hearingsPerYear} {...accessors} />
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
            </Grid>
            <Grid item xs={12}>
              <strong>Additional Filter Options</strong>
              <div>
                <InputLabel>Year</InputLabel>
                <Select id="year-selector" multiple value={yearsSelected} onChange={handleChange}>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </Grid>
            <Grid item xs={12}>
              <MaterialTable
                columns={[
                  { title: 'Date', field: 'Date' },
                  { title: 'URL', field: 'URL' },
                  { title: 'Title', field: 'Title' },
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
