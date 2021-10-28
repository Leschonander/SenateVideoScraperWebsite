import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import * as d3 from 'd3';

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
      <div>
        <p>
          There have been <span className={classes.colorSpan}>{loading === false ? data.length : '?'}</span> hearings
          collected so far.
        </p>

        <p>
          This service exists because surprisingly, the Senate does not have a central repository for the hearings. In
          response to this, I built up a scraper to scrape said hearings and aggergate this data. You can find this{' '}
          <a href="https://github.com/Leschonander/SenateVideoScraper">here</a>. There you can look at the code, see the
          various csv's for the a given a committee.
        </p>

        <p>
          To actually use this service, you can use the search bar contained in the table to search for a specific
          hearing. You can also go to the bottom of the page and flip between pages as well.
        </p>
      </div>
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
