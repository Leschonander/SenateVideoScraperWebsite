import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import Copyright from 'src/Copyright';
import Link from 'src/Link';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    listItem: { color: 'white' },
    title: {
      color: 'white',
      marginRight: '10px',
    },
    appBar: {
      background: '#222222',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    footer: {},
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      background: '#223741',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      background: '#223741',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(2),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    pageWrapper: {
      minHeight: '80vh',
    },
    content: {
      width: '100vw',
      padding: theme.spacing(3),
    },
    menuButton: {
      color: 'white',
    },
  })
);

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);

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

  const handleClick = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Link className={classes.title} href="/">
            <a>
              <Typography variant="h6" noWrap>
                Senate Committee Hearing Repository
              </Typography>
            </a>
          </Link>
          <Link className={classes.title} href="/about">
            <a>
              <Typography variant="h6" noWrap>
                About
              </Typography>
            </a>
          </Link>
          <Button className={classes.menuButton} onClick={handleClick}>
            <MenuIcon />
          </Button>
        </Toolbar>
      </AppBar>

      <Menu id="simple-menu" anchorEl={open} keepMounted={false} open={Boolean(open)} onClose={handleClose}>
        {committees.map((c, index) => (
          <MenuItem onClick={handleClose}>
            <Link href={`/committee/${c}`}>{c}</Link>
          </MenuItem>
        ))}
      </Menu>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.pageWrapper}>{children}</div>
        <div className={classes.footer}>
          <Copyright />
        </div>
      </main>
    </div>
  );
}
