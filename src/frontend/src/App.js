import React, { Component } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpensesTable from './components/ExpensesTable';

class App extends Component {
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

    console.log(expenses);
  }

  render() {
    return (
      <div>
        <ExpenseForm />
        <ExpensesTable expenses={this.state.expenses} />
      </div>
    );
  }
}

export default App;
