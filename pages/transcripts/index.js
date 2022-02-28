import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as d3 from 'd3';
import Grid from '@material-ui/core/Grid';
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

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
  const url = 'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/transcripts/New_T_File.csv'; // transcript_text
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
        <Grid item xs={12} sm={6}>
          <h4>Search Senate Witness Transcripts</h4>
          <p>FAQ</p>
          <p>1. What is this search exactly searching?</p>
          <p>
            This search is a full-text-search of the text <i>contained</i> within the PDF's of peoples various
            testimonies to the Senate. It is <i>not</i> a search of the titles of the various PDF's.
          </p>

          <p>2. Why is this important?</p>
          <p>
            At the moment, much like the hearings themselves, there is no easy way to search the text of the various
            testimonies that witnesses have given over the years. By extracting the text from the testimonies and making
            them searchable, it is easier to find out what past witnesses had said to Congress on various issues.
          </p>

          <p>3. Why is it a bit slow?</p>
          <p>
            The full text search at the moment is on the client side, it is currently being migrated to be done
            differently to ensure a higher quality user experince.
          </p>
          <TextField label="Search" value={searchText} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={12}></Grid>
        {searchData.length === 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hearing Name</TableCell>
                  <TableCell>Transcript URL</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hearing Name</TableCell>
                  <TableCell>Transcript URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchData.map((s, index) => (
                  <TableRow key={index}>
                    <TableCell>{s.item.name}</TableCell>
                    <TableCell>{s.item.url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </div>
  );
}
