import React from 'react';
import { socket } from '../../socket'; // TODO: Changer socket par un callback

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = {
  body: {
    overflow: "scroll"
  }
};

class DataTable extends React.Component {
  constructor() {
    super();

    this.state = {
      sort: {}
    };
  }

  selectRow() {
    // TODO: selectRow
  }

  sort(field) {
    let direction= "desc";
    if (this.state.sort.direction == "desc") {
      direction = "asc";
    }
    this.setState({sort:{direction, field}});
    socket.emit("order-by", {direction, field});
  }

  render() {
    const classes = this.props.classes;

    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.props.head.map((head)=>{
              return (
                <TableCell key={head}>
                  <TableSortLabel
                    active={(this.state.sort.field == head)}
                    direction={this.state.sort.direction}
                    onClick={this.sort.bind(this, head)} >
                    {head}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody className={classes.body}>
          {this.props.body.map((row)=>{
            return(
              <TableRow key={row.id} hover onClick={this.selectRow.bind(this, row)}>
                {this.props.head.map((head)=>{
                  return (
                    <TableCell key={head}>
                      {row[head]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        {/*<TablePagination />*/}
      </Table>
    );
  }
}

export default withStyles(styles)(DataTable);
