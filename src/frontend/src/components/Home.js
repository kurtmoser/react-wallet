import React, { Component } from 'react'
import axios from 'axios';
import { AppBar, Grid, Toolbar } from '@material-ui/core';
import ExpenseForm from './ExpenseForm';
import ExpensesTable from './ExpensesTable';
import {
  format as dateFormat,
  parse as dateParse,
  startOfDay as dateStartOfDay,
  startOfWeek as dateStartOfWeek,
} from 'date-fns';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: null,
      dailyExpenseSum: 0,
      weeklyExpenseSum: 0,
    }
  }

  async componentDidMount() {
    const expenses = (await axios.get('http://localhost:8000/expenses')).data;

    const startOfWeek = dateStartOfWeek(new Date(), { weekStartsOn: 1 });
    const startOfDay = dateStartOfDay(new Date(), { weekStartsOn: 1 });

    let dailyExpenseSum = 0;
    let weeklyExpenseSum = 0;

    expenses.map((expense) => {
      const spendDate = dateParse(expense.sdate, 'yyyy-MM-dd', new Date());

      if (spendDate >= startOfWeek) {
        weeklyExpenseSum += expense.amount;
      }

      if (spendDate >= startOfDay) {
        dailyExpenseSum += expense.amount;
      }
    });

    this.setState({
      expenses,
      dailyExpenseSum,
      weeklyExpenseSum,
    });
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container>
              <Grid item xs={6}>
                Daily: &euro; {this.state.dailyExpenseSum.toFixed(2)}
              </Grid>
              <Grid item xs={6} align="right">
                Weekly: &euro; {this.state.weeklyExpenseSum.toFixed(2)}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <ExpenseForm />
        <ExpensesTable expenses={this.state.expenses} />
      </div>
    )
  }
}

export default Home;
