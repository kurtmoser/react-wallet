import React, { Component } from 'react'
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpensesTable from './ExpensesTable';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: null,
    }
  }

  async componentDidMount() {
    const expenses = (await axios.get('http://localhost:8000/expenses')).data;

    this.setState({
      expenses
    });
  }

  render() {
    return (
      <div>
        <ExpenseForm />
        <ExpensesTable expenses={this.state.expenses} />
      </div>
    )
  }
}

export default Home
