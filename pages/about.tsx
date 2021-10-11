import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      width: '50%',
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

export default function AboutPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h2" align="center">
        About
      </Typography>
      <Typography gutterBottom variant="h4" align="center">
        A project maintained by Lars Erik Schönander (currently)
      </Typography>
      <p>
        In the halls of the Senate, there turned out be a specific problem, that there is no central source of committee
        hearings for one to look at. If one wants to search for a given hearing, you have to go the specific committees
        website
      </p>

      <p>Lincoln Network has decidied to solve this.</p>

      <p>
        Along with the scraper maintined <a href="https://github.com/Leschonander/SenateVideoScraper"></a>
        this website on the main page will provide a easy to use interface to search through the various Senate
        committee hearings.
      </p>
    </div>
  );
}
