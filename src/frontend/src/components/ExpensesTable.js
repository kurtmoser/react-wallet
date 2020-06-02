import React, { Component } from 'react'
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export class ExpensesTable extends Component {
  render() {
    return (
      <Container maxWidth="md">
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
            {
              this.props.expenses && this.props.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.location} - {expense.goods}<br/>{expense.sdate}</TableCell>
                  <TableCell align="right">
                    &euro; {expense.amount}
                    <Link to={`/expenses/${expense.id}`}>
                      <Button
                        variant="outlined"
                        style={{marginLeft: 8}}
                      >
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  }
}

export default ExpensesTable
