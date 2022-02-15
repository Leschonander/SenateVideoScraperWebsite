import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Link from 'next/link';

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
import Fuse from 'fuse.js';
import TextField from '@material-ui/core/TextField';

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
  // May need to movie this to component side depending on how large it get's later on...
  const url = 'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/transcripts/transcript_text.csv';
  let data = await d3.csv(url);

  return {
    props: { data: data },
  };
}

export default function TranscriptDashboard(props) {
  const classes = useStyles();

  const [data, setData] = React.useState(props.data);
  const [searchData, setSearchData] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const options = {
    keys: ['name', 'text'],
  };

  const truncateString = (string = '', maxLength = 50) =>
    string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;

  const fuse = new Fuse(data, options);
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  React.useEffect(() => {
    const search_results = fuse.search(searchText);
    setSearchData(search_results);
  }, [searchText]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <p>Search Senate Witness Transcripts</p>
          <TextField label="Search" value={searchText} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={12}></Grid>
        {searchData.length === 0 ? (
          <>Empty</>
        ) : (
          <>
            {searchData.map((s) => (
              <div>
                <h3>{s.item.name}</h3>
                <p>{s.item.url}</p>
              </div>
            ))}
          </>
        )}
      </Grid>
    </div>
  );
}
