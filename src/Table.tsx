import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import { Donation } from 'src/types';
import { IconButton, Tooltip, CircularProgress, Select, Box } from '@material-ui/core';
import { PAGE_SIZE } from 'src/constants';

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Donation;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'donorId',
    numeric: false,
    disablePadding: true,
    label: 'Donor ID',
  },
  {
    id: 'donorName',
    numeric: true,
    disablePadding: false,
    label: 'Donor name',
  },
  {
    id: 'donorEmail',
    numeric: true,
    disablePadding: false,
    label: 'Donor email',
  },
  {
    id: 'donorGender',
    numeric: true,
    disablePadding: false,
    label: 'Donor Gender',
  },
  {
    id: 'donorAddress',
    numeric: true,
    disablePadding: false,
    label: 'Donor Address',
  },
  {
    id: 'donationAmount',
    numeric: true,
    disablePadding: false,
    label: 'Donation Amount',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Donation) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isTableEditable: boolean;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, isTableEditable, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Donation) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {isTableEditable && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all' }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {isTableEditable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    select: { width: 120 },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  currentPageSize: number;
  setPage: Function;
  currentPageNum: number;
  orderBy: string;
  order: string;
  isTableEditable: boolean;
  anonymousState: string;
  isLoading: boolean;
  refetch?: Function;
  setAnonymous: Function;
  setLoading: Function;
  setSelected: Function;
  selected: string[];
  rows: Array<Donation & { rowId: string }>;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    refetch,
    setPage,
    currentPageSize,
    orderBy,
    order,
    anonymousState,
    setAnonymous,
    setLoading,
    setSelected,
    isLoading,
    numSelected,
    selected,
    rows,
    isTableEditable,
  } = props;

  const handleAnonymous = async (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setLoading(true);
    const value = event.target.value;
    setPage(0);
    if (refetch) {
      await refetch({
        anonymous: value,
        page_size: currentPageSize,
        page_num: 0,
        ascending: order,
        sortField: orderBy,
      });
    }
    setLoading(false);
    setAnonymous(value);
  };

  const deleteDonations = async () => {
    setLoading(true);
    const selectedIds = rows
      .filter((r) => selected.includes(r.rowId))
      .map((s) => {
        return s._id;
      });
    await fetch('/api/donations/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedIds),
    });
    setPage(0);

    if (refetch) {
      await refetch({
        anonymous: anonymousState,
        page_size: currentPageSize,
        page_num: 0,
        ascending: order,
        sortField: orderBy,
      });
    }
    setSelected([]);
    setLoading(false);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Donations
        </Typography>
      )}
      {isLoading && <CircularProgress thickness={4} size={32} />}
      {isTableEditable && (
        <Tooltip title="Toggle anonymous donors">
          <Select
            native
            value={anonymousState}
            className={classes.select}
            onChange={handleAnonymous}
            inputProps={{
              name: 'anonymous',
            }}
          >
            <option value={'all'}>All</option>
            <option value={'anonymous'}>Anonymous</option>
            <option value={'users'}>Users</option>
          </Select>
        </Tooltip>
      )}
      {numSelected > 0 && isTableEditable && (
        <Tooltip title="Delete selected">
          <IconButton onClick={deleteDonations} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

interface Props {
  rows: Donation[];
  refetch?: Function;
  isTableEditable?: boolean;
  donationsCount: number;
}
export default function EnhancedTable(props: Props) {
  const classes = useStyles();
  const { refetch, donationsCount, rows: rowsData, isTableEditable = false } = props;

  const rows: Array<Donation & { rowId: string }> = rowsData?.map((r, index) => ({
    ...r,
    rowId: `tableId~${index}`,
  }));

  const [isLoading, setLoading] = React.useState(false);
  const [anonymousState, setAnonymous] = React.useState('all');

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Donation>('donationAmount');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(PAGE_SIZE);

  const handleRequestSort = async (_event: React.MouseEvent<unknown>, property: keyof Donation) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
    if (refetch) {
      setLoading(true);
      await refetch({
        anonymous: anonymousState,
        page_size: rowsPerPage,
        page_num: 0,
        ascending: !isAsc,
        sortField: property,
      });
      setLoading(false);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.rowId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = async (_event: unknown, newPage: number) => {
    setPage(newPage);
    if (refetch && newPage * rowsPerPage >= rows.length) {
      setLoading(true);
      await refetch({
        append: true,
        anonymous: anonymousState,
        page_size: rowsPerPage,
        page_num: newPage,
        ascending: order,
        sortField: orderBy,
      });
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    setPage(0);
    if (refetch && newPageSize > rows.length) {
      setLoading(true);
      await refetch({
        anonymous: anonymousState,
        page_size: newPageSize,
        page_num: 0,
        ascending: order,
        sortField: orderBy,
      });
      setLoading(false);
    }
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          orderBy={orderBy}
          order={order}
          isLoading={isLoading}
          setLoading={setLoading}
          setSelected={setSelected}
          anonymousState={anonymousState}
          setPage={setPage}
          refetch={refetch}
          setAnonymous={setAnonymous}
          currentPageNum={page}
          currentPageSize={rowsPerPage}
          rows={rows}
          isTableEditable={isTableEditable}
          selected={selected}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" size="small" aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              isTableEditable={isTableEditable}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.rowId as string);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.rowId as string)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.rowId}
                    selected={isItemSelected}
                  >
                    {isTableEditable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                      </TableCell>
                    )}
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.donorId}
                    </TableCell>
                    <TableCell align="right">{row.donorName}</TableCell>
                    <TableCell align="right">{row.donorEmail}</TableCell>
                    <TableCell align="right">{row.donorGender}</TableCell>
                    <TableCell align="right">{row.donorAddress}</TableCell>
                    <TableCell align="right">{row.donationAmount}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {isLoading ? (
          <Box padding={1} textAlign="center">
            <CircularProgress thickness={3} size={32} />
          </Box>
        ) : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={donationsCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </div>
  );
}
