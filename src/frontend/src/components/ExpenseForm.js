import React, { Component } from 'react'
import { Button, Container, Dialog, DialogTitle, DialogActions, Paper, TextField } from '@material-ui/core';
import { format as dateFormat } from 'date-fns';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

export class ExpenseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      sdate: dateFormat(new Date(), 'yyyy-MM-dd'),
      location: '',
      goods: '',
      dialogOpen: false,
    }

    this.submitEnabled = this.submitEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirmOpen = this.handleDeleteConfirmOpen.bind(this);
    this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
  }

  async componentDidMount() {
    if (this.props.expenseId) {
      const expense = (await axios.get('http://localhost:8000/expenses/' + this.props.expenseId)).data;

      this.setState({
        amount: expense.amount,
        sdate: expense.sdate,
        location: expense.location,
        goods: expense.goods,
      });
    } else {
      this.setState({
        sdate: dateFormat(new Date(), 'yyyy-MM-dd'),
      });
    }
  }

  submitEnabled() {
    return this.state.amount
      && this.state.sdate
      && this.state.location
      && this.state.goods;
  }

  async handleAdd() {
    const res = await axios.post('http://localhost:8000/expenses', {
      amount: this.state.amount,
      sdate: this.state.sdate,
      location: this.state.location,
      goods: this.state.goods,
    });
  }

  async handleEdit() {
    const res = await axios.put('http://localhost:8000/expenses/' + this.props.expenseId, {
      amount: this.state.amount,
      sdate: this.state.sdate,
      location: this.state.location,
      goods: this.state.goods,
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
          <TextField
            name="sdate"
            value={this.state.sdate}
            variant="outlined"
            label="Date"
            onChange={this.handleChange}
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
                disabled={!this.submitEnabled()}
                color="primary"
                style={{ margin: 8, float: 'right'}}
                onClick={this.handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                disabled={!this.submitEnabled()}
                color="secondary"
                style={{ margin: 8, float: 'right'}}
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
