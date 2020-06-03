import React, { Component } from 'react'
import { Button, Container, Dialog, DialogTitle, DialogActions, Paper, TextField } from '@material-ui/core';
import { format as dateFormat, parse as dateParse } from 'date-fns';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';

export class ExpenseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      sdate: null,
      location: '',
      goods: '',
      originalExpense: null,
      dialogOpen: false,
    }

    this.submitEnabled = this.submitEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirmOpen = this.handleDeleteConfirmOpen.bind(this);
    this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.isPristine = this.isFormPristine.bind(this);
  }

  async componentDidMount() {
    if (this.props.expenseId) {
      const res = (await axios.get('http://localhost:8000/expenses/' + this.props.expenseId)).data;

      const expense = {
        amount: res.amount.toFixed(2),
        sdate: dateParse(res.sdate, 'yyyy-MM-dd', new Date()),
        location: res.location,
        goods: res.goods,
      };

      this.setState({
        ...expense,
        originalExpense: expense,
      });
    } else {
      this.setState({
        sdate: new Date(),
      });
    }
  }

  submitEnabled() {
    return this.state.amount
      && this.state.sdate
      && this.state.location
      && this.state.goods;
  }

  isFormPristine() {
    if (!this.state.originalExpense) {
      return true;
    }

    let expense = {
      amount: this.state.amount,
      sdate: this.state.sdate,
      location: this.state.location,
      goods: this.state.goods,
    };

    return JSON.stringify(expense) === JSON.stringify(this.state.originalExpense);
  }

  async handleAdd() {
    let expense = {
      amount: this.state.amount,
      sdate: dateFormat(this.state.sdate, 'yyyy-MM-dd'),
      location: this.state.location,
      goods: this.state.goods,
    };

    const res = await axios.post('http://localhost:8000/expenses', expense);

    // Clean up form
    this.setState({
      amount: '',
      sdate: new Date(),
      location: '',
      goods: '',
    });
  }

  async handleEdit() {
    let expense = {
      amount: this.state.amount,
      sdate: dateFormat(this.state.sdate, 'yyyy-MM-dd'),
      location: this.state.location,
      goods: this.state.goods,
    };

    const res = await axios.put('http://localhost:8000/expenses/' + this.props.expenseId, expense);

    // Sync original expense
    this.setState({
      originalExpense: {
        amount: res.data.amount.toFixed(2),
        sdate: dateParse(res.data.sdate, 'yyyy-MM-dd', new Date()),
        location: res.data.location,
        goods: res.data.goods,
      },
    });
  }

  handleDeleteConfirmOpen() {
    this.setState({
      dialogOpen: true,
    });
  }

  handleDeleteConfirmClose() {
    this.setState({
      dialogOpen: false,
    });
  }

  async handleDelete() {
    this.handleDeleteConfirmClose();

    const res = await axios.delete('http://localhost:8000/expenses/' + this.props.expenseId);

    if (res.status === 204) {
      this.props.history.replace('/');
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleDateChange(date) {
    this.setState({
      sdate: date,
    });
  };

  render() {
    return (
      <Container maxWidth="sm">
        <br />
        <Paper style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            name="amount"
            value={this.state.amount}
            variant="outlined"
            label="Amount"
            onChange={this.handleChange}
            style={{margin: 8, marginTop: 12}}
          />
          <KeyboardDatePicker
              inputVariant="outlined"
              label="Date"
              format="yyyy-MM-dd"
              value={this.state.sdate}
              onChange={this.handleDateChange}
              style={{margin: 8, marginTop: 12}}
            />
          <TextField
            name="location"
            value={this.state.location}
            variant="outlined"
            label="Location"
            onChange={this.handleChange}
            style={{margin: 8, marginTop: 12}}
          />
          <TextField
            name="goods"
            value={this.state.goods}
            variant="outlined"
            label="Goods"
            onChange={this.handleChange}
            style={{margin: 8, marginTop: 12}}
          />
          {
            !this.props.expenseId && <div>
              <Button
                variant="contained"
                disabled={!this.submitEnabled()}
                color="primary"
                style={{ margin: 8, float: 'right'}}
                onClick={this.handleAdd}
              >
                Add
              </Button>
            </div>
          }
          {
            this.props.expenseId && <div>
              <Button
                variant="contained"
                disabled={!this.submitEnabled() || this.isFormPristine()}
                color="primary"
                style={{ margin: 8, float: 'right'}}
                onClick={this.handleEdit}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{ margin: 8, marginRight: 0, float: 'right'}}
                onClick={this.handleDeleteConfirmOpen}
              >
                Delete
              </Button>
              <Dialog
                maxWidth="xs"
                fullWidth
                open={this.state.dialogOpen}
              >
                <DialogTitle id="alert-dialog-title">{"Delete expense?"}</DialogTitle>
                <DialogActions>
                  <Button onClick={this.handleDeleteConfirmClose} color="primary">
                    No
                  </Button>
                  <Button onClick={this.handleDelete} value={true} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          }
        </Paper>
        <br />
      </Container>
    )
  }
}

export default withRouter(ExpenseForm);
