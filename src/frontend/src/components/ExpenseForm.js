import React, { Component } from 'react'
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogTitle,
  DialogActions,
  Paper,
  TextField
} from '@material-ui/core';
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
      topLocations: null,
      topGoods: null,
    }

    this.refreshTopLocations = this.refreshTopLocations.bind(this);
    this.refreshTopGoods = this.refreshTopGoods.bind(this);

    this.timer = null;
  }

  async componentDidMount() {
    if (this.props.expenseId) {
      const res = (await axios.get('/api/expenses/' + this.props.expenseId)).data;

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

    this.refreshTopLocations();
    this.refreshTopGoods();
  }

  async refreshTopLocations() {
    const res = (await axios.get('/api/top/locations' + '?location=' + this.state.location)).data;

    this.setState({
      topLocations: res,
    });
  }

  async refreshTopGoods() {
    const res = (await axios.get('/api/top/goods' + '?goods=' + this.state.goods + '&location=' + this.state.location)).data;

    this.setState({
      topGoods: res,
    });
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

    const res = await axios.post('/api/expenses', expense);

    // Clean up form
    this.setState({
      amount: '',
      sdate: new Date(),
      location: '',
      goods: '',
    });

    this.props.refreshExpenses();
  }

  async handleEdit() {
    let expense = {
      amount: this.state.amount,
      sdate: dateFormat(this.state.sdate, 'yyyy-MM-dd'),
      location: this.state.location,
      goods: this.state.goods,
    };

    const res = await axios.put('/api/expenses/' + this.props.expenseId, expense);

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

    const res = await axios.delete('/api/expenses/' + this.props.expenseId);

    if (res.status === 204) {
      this.props.history.replace('/');
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });

    if (event.target.name === 'location') {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(this.refreshTopLocations, 200);
    } else if (event.target.name === 'goods') {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(this.refreshTopGoods, 200);
    }
  }

  handleDateChange(date) {
    this.setState({
      sdate: date,
    });
  };

  handleLocationSuggestionClick(location) {
    this.setState({
      location
    }, this.refreshTopLocations);
  }

  handleGoodsSuggestionClick(goods) {
    this.setState({
      goods
    }, this.refreshTopGoods);
  }

  handleAmountBlur() {
    if (this.state.amount) {
      this.setState({
        amount: parseFloat(this.state.amount).toFixed(2),
      });
    }
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
            onChange={(e) => this.handleChange(e)}
            onBlur={() => this.handleAmountBlur()}
            type="number"
            style={{margin: 8, marginTop: 12}}
            autoComplete="off"
          />
          <KeyboardDatePicker
              inputVariant="outlined"
              label="Date"
              format="yyyy-MM-dd"
              value={this.state.sdate}
              onChange={(e) => this.handleDateChange(e)}
              style={{margin: 8, marginTop: 12}}
            />
          <TextField
            name="location"
            value={this.state.location}
            variant="outlined"
            label="Location"
            onChange={(event) => this.handleChange(event)}
            style={{margin: 8, marginTop: 12}}
            autoComplete="off"
          />
          <div
            style={{marginLeft: 8, marginRight: 8}}
          >
            {
              this.state.topLocations && this.state.topLocations.map((loc) => (
                <Chip
                  key={loc.location}
                  label={loc.location}
                  size="small"
                  style={{marginRight: 8}}
                  onClick={() => this.handleLocationSuggestionClick(loc.location)}
                />
              ))
            }
          </div>
          <TextField
            name="goods"
            value={this.state.goods}
            variant="outlined"
            label="Goods"
            onChange={(e) => this.handleChange(e)}
            style={{margin: 8, marginTop: 12}}
            autoComplete="off"
          />
          <div
            style={{marginLeft: 8, marginRight: 8}}
          >
            {
              this.state.topGoods && this.state.topGoods.map((goods) => (
                <Chip
                  key={goods.goods}
                  label={goods.goods}
                  size="small"
                  style={{marginRight: 8, marginBottom: 8}}
                  onClick={() => this.handleGoodsSuggestionClick(goods.goods)}
                />
              ))
            }
          </div>
          {
            !this.props.expenseId && <div>
              <Button
                variant="contained"
                disabled={!this.submitEnabled()}
                color="primary"
                style={{ margin: 8, float: 'right'}}
                onClick={() => this.handleAdd()}
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
                onClick={() => this.handleEdit()}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{ margin: 8, marginRight: 0, float: 'right'}}
                onClick={() => this.handleDeleteConfirmOpen()}
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
                  <Button onClick={() => this.handleDeleteConfirmClose()} color="primary">
                    No
                  </Button>
                  <Button onClick={() => this.handleDelete()} value={true} color="primary" autoFocus>
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
