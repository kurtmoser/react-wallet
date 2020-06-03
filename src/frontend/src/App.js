import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './components/Home';
import ExpenseEdit from './components/ExpenseEdit';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

class App extends Component {
  render() {
    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Route exact path='/' component={Home} />
          <Route exact path='/expenses/:id' component={ExpenseEdit} />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default App;
