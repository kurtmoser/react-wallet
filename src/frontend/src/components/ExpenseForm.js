import React, { Component } from 'react'
import { Button, Container, Paper, TextField } from '@material-ui/core';
import { format as dateFormat } from 'date-fns';
import axios from 'axios';

export class ExpenseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      sdate: dateFormat(new Date(), 'yyyy-MM-dd'),
      location: '',
      goods: '',
    }

    this.submitEnabled = this.submitEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  submitEnabled() {
    return this.state.amount
      && this.state.sdate
      && this.state.location
      && this.state.goods;
  }

  async handleSubmit() {
    const res = await axios.post('http://localhost:8000/expenses', {
      amount: this.state.amount,
      sdate: this.state.sdate,
      location: this.state.location,
      goods: this.state.goods,
    });

    console.log(res);
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
          <div>
            <Button
              variant="contained"
              disabled={!this.submitEnabled()}
              color="primary"
              style={{ margin: 8, float: 'right'}}
              onClick={this.handleSubmit}
            >
              Add
            </Button>
          </div>
        </Paper>
        <br />
      </Container>
    )
  }
}

export default ExpenseForm
