import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

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

export async function getServerSideProps(context) {
  let csv_data = await d3.csv(
    'https://gist.githubusercontent.com/Leschonander/a749560721d2b92183403a04fa1c821b/raw/dd0e02fb3f50627ee049307273d5d8e683dc2bd8/TagFile.csv'
  );

  return {
    props: { tags: csv_data },
  };
}

export default function SearchHearingDashboard(props) {
  const classes = useStyles();
  console.log(props.tags);

  const committees = [
    'Armed',
    'JEC',
    'Health',
    'Budget',
    'Judiciary',
    'Approporiations',
    'SBC',
    'Intelligence',
    'Agriculture',
    'Commerce',
    'Rules',
    'Indian Affairs',
    'Finance',
    'Energy',
    'Homeland Security',
    'Foreign',
    'Enviroment',
    'Banking',
    'Veterans',
  ];

  const [comm, setComm] = React.useState('');
  const handleChange = (event) => {
    setComm(event.target.value);
  };

  // const [data, setData] = React.useState([]);
  // const [dataMaster, setDataMaster] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);

  const url =
    'https://gist.githubusercontent.com/Leschonander/53d6167bcf24b0ccf3363d3048f30736/raw/c7528cfb1a31ee5cb2f589c406f0d05367022d51/MasterFileWithTags.csv';

  /*
  React.useEffect(() => {
    d3.csv(url).then((d) => {
      let d_cleaned = d
        .map((c) => ({ ...c, Witnesses: eval(c['Witnesses']) }))
        .map((c) => ({ ...c, Tags: eval(c['Tags']) }))
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
  */

  return (
    <div className={classes.root}>
      <Typography>Search</Typography>

      <TextField id="standard-basic" label="Standard" variant="standard" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} className={classes.card}>
          <h3>Committees</h3>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={comm} onChange={handleChange}>
            {committees.map((c, index) => (
              <MenuItem value={c}>{c}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4} className={classes.card}>
          <h3>Tags</h3>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={comm} onChange={handleChange}>
            {props.tags.map((c, index) => (
              <MenuItem value={c.Tags}>{c.Tags}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </div>
  );
}
