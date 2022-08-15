import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import React from 'react';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) =>
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
  const [dataMaster, setDataMaster] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const url =
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv';

  React.useEffect(() => {
    d3.csv(url).then((d) => {
      let d_cleaned = d
        .map((c) => ({ ...c, Witnesses: eval(c['Witnesses']) }))
        .map((item) => {
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
          }
          return item;
        });

      // console.log(d_cleaned);
      setData(d_cleaned);
      setDataMaster(d_cleaned);
      setLoading(false);
    });
    return () => undefined;
  }, []);

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

  counts = Object.keys(counts).map((key) => ({ key: key, value: counts[key] }));
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
            icons={tableIcons}
            columns={[
              { title: 'Date', field: 'Date' },
              { title: 'URL', field: 'URL' },
              { title: 'Title', field: 'Title' },
              { title: 'Committee', field: 'Committee' },
              { title: 'Video Url', field: 'video_url' },
              { title: 'Witnesses', field: 'Witnesses' },
              { title: 'Tags', field: 'Tags' },
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
