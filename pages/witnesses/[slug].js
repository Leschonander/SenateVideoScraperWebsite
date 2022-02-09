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
  const id = context.query.slug;
  console.log(id);

  let csv_data_witness = await d3.csv(
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/witnessList/wit_count.csv'
  );

  csv_data_witness = csv_data_witness.filter((d) => d.id === id);

  let csv_data_hearings = await d3.csv(
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
  );
  csv_data_hearings = csv_data_hearings.map((c) => ({ ...c, Witnesses: eval(c['Witnesses']) }));
  csv_data_hearings = csv_data_hearings.map((item) => {
    if (Array.isArray(item.Witnesses)) {
      if (item.Witnesses.includes(csv_data_witness[0].Witnesses)) {
        const updatedItem = {
          ...item,
          Witnesses: item.Witnesses.join('\n'),
        };
        return updatedItem;
      }
    }
  });
  csv_data_hearings = csv_data_hearings.filter((c) => {
    return c !== undefined;
  });
  // console.log(csv_data_hearings)

  return {
    props: { witness_data: csv_data_witness[0], data: csv_data_hearings },
  };
}

export default function witnessSpecificDashboard(props) {
  const classes = useStyles();
  console.log(props);
  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" align="center">
        Witness: {props.witness_data.Witnesses}
      </Typography>
      <p>
        {props.witness_data.Witnesses} has appeared in {props.witness_data.count} Senate Hearings.
      </p>
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
          ]}
          data={props.data}
          title="Senate Committee Hearings"
          options={{
            exportAllData: true,
            exportButton: {
              csv: true,
            },
          }}
        />
      </div>
    </div>
  );
}
