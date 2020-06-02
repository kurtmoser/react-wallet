import React, { Component } from 'react'
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';

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
                  <TableCell align="right">&euro; {expense.amount}</TableCell>
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
