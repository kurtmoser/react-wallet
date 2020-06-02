import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import ExpenseEdit from './components/ExpenseEdit';

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/expenses/:id' component={ExpenseEdit} />
      </div>
    );
  }
}

export default App;
