import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import * as d3 from 'd3';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      width: '80%',
      margin: '0 auto',
    },
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

export async function getServerSideProps(context) {
  let csv_data = await d3.csv(
    'https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv'
  );

  return {
    props: { total_rows: csv_data.length },
  };
}

export default function AboutPage(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Typography gutterBottom variant="h2" align="left">
            About
          </Typography>
          <p>
            The Senate on it's 20 something committees each has there own unique way of displaying and searching for
            hearings. These hearings can be used for research, or for staff and think-tanks to simple have a record of
            events they participated in.
          </p>
          <p>Until today, there was no central location to search for hearings.</p>

          <p>
            There are <span>{props.total_rows}</span> hearings on the website at the moment. The number changes
            regularly.
          </p>

          <p>
            It is based on the committee hearings that are listed on the tables for every committees given website. For
            certain committees, we don't go far as back depending of their website keeps older hearings up or not. Some
            do, some don't.
          </p>

          <p>
            This website shows that is is possible to have a central location for all the hearings on the Senate side.
          </p>

          <p>
            To understand more why and how this was built, you can read this{' '}
            <a href="https://lincolnpolicy.org/2022/video-from-all-senate-committee-proceedings-in-one-place/">
              article
            </a>
            from Lincoln Network.
          </p>

          <Typography gutterBottom variant="h6" align="left">
            Acknowledgements
          </Typography>

          <p>
            We owe Daniel Schuman and Lars Erik Schonander for this website. Daniel for the idea and knowing who to talk
            to on the hill, and Lars for developing the website.
          </p>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography gutterBottom variant="h2" align="left" style={{ visibility: 'hidden' }}>
            About
          </Typography>
          <a href="https://github.com/Leschonander/SenateVideoScraper">Github</a>
          <Typography gutterBottom variant="h6" align="left">
            Who we are
          </Typography>
          <p>
            senatecommitteehearings.com is a project of Demand Progress in collaboration with the Congressional Data
            Coalition and Lincoln Network.
          </p>
          <Typography gutterBottom variant="h6" align="left">
            Contact information
          </Typography>
          <p>
            You can reach the primary developer of this project at{' '}
            <a href="https://twitter.com/LarsESchonander">@LarsESchonander</a>.
          </p>
          <Typography gutterBottom variant="h6" align="left">
            Bulk download
          </Typography>

          <p>
            All of the hearing data is downloadable. For a masterfile, you can go{' '}
            <a href="https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv">
              here
            </a>
            .
          </p>
        </Grid>
      </Grid>
    </div>
  );
}
