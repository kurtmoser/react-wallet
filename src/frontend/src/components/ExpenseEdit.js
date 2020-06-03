import React, { Component } from 'react'
import ExpenseForm from './ExpenseForm';
import { AppBar, Toolbar } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withRouter } from 'react-router-dom';

export class ExpenseEdit extends Component {
  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    this.props.history.replace('/');
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <ArrowBackIcon onClick={this.handleBack} style={{ cursor: 'pointer' }} />
          </Toolbar>
        </AppBar>

        <ExpenseForm expenseId={this.props.match.params.id} />
      </div>
    )
  }
}

export default withRouter(ExpenseEdit);
