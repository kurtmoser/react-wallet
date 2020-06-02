import React, { Component } from 'react'
import ExpenseForm from './ExpenseForm';

export class ExpenseEdit extends Component {
  render() {
    return (
      <div>
        <ExpenseForm expenseId={this.props.match.params.id} />
      </div>
    )
  }
}

export default ExpenseEdit
