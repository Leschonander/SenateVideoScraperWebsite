import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
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
import { useRouter } from 'next/router';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
      [theme.breakpoints.down('450')]: {
        fontSize: '12px',
      },
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
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
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
      marginRight: 36,
    },
    linkStyle: {
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.87)',
    },
  })
);

export default function DashboardLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);
  const matches = useMediaQuery('(max-width:750px)');

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
      <AppBar position="fixed" className={classes.appBar}>
        {matches === true ? (
          <Toolbar>
            <Link href="/">
              <a>
                <Typography variant="h6" noWrap className={classes.title}>
                  Senate Committee Hearing Repository
                </Typography>
              </a>
            </Link>
            <Button className={classes.menuButton} onClick={handleClick}>
              <MenuIcon />
            </Button>
          </Toolbar>
        ) : (
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

            <Link className={classes.title} href="/last_week">
              <a>
                <Typography variant="h6" noWrap>
                  Hearings last week
                </Typography>
              </a>
            </Link>

            <Link
              className={classes.title}
              href="https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv"
              passhref
            >
              <a>
                <Typography variant="h6" noWrap>
                  Data
                </Typography>
              </a>
            </Link>
            <Button className={classes.menuButton} onClick={handleClick}>
              <MenuIcon />
            </Button>
          </Toolbar>
        )}
      </AppBar>

      <Menu id="simple-menu" anchorEl={open} keepMounted={false} open={Boolean(open)} onClose={handleClose}>
        {matches === true ? (
          <>
            <MenuItem
              onClick={() => {
                handleClose();
              }}
            >
              <a href={`/about`} className={classes.linkStyle}>
                About
              </a>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
              }}
            >
              <a href={`/last_week`} className={classes.linkStyle}>
                Hearings last week
              </a>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
              }}
            >
              <a
                href={`https://raw.githubusercontent.com/Leschonander/SenateVideoScraper/master/SenateVideoFiles/MasterFile.csv`}
                className={classes.linkStyle}
              >
                Data
              </a>
            </MenuItem>
            {committees.map((c, index) => (
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
              >
                <a href={`/committee/${c}`} className={classes.linkStyle}>
                  {c}
                </a>
              </MenuItem>
            ))}
          </>
        ) : (
          <>
            {committees.map((c, index) => (
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
              >
                <a href={`/committee/${c}`} className={classes.linkStyle}>
                  {c}
                </a>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.pageWrapper}>{children}</div>
        <div className={classes.footer}></div>
      </main>
    </div>
  );
}
