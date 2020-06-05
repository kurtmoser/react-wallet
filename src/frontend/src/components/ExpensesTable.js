import React, { Component } from 'react'
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
                  <TableCell>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                      <div style={{border: 'solid 0px #f00'}}>
                        &euro; {expense.amount.toFixed(2)}
                      </div>
                      <div style={{display: 'flex', border: 'solid 0px #f00', marginLeft: 16}}>
                        <Link to={`/expenses/${expense.id}`} style={{display: 'flex'}}>
                          <MoreVertIcon style={{border: 'solid 0px #0f0', color: 'rgba(0, 0, 0, 0.5)'}}/>
                        </Link>
                      </div>
                    </div>
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
