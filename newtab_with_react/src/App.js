import 'bootstrap-webpack';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <form className="form">
          <h2>百度搜索</h2>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search for..." />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">Go!</button>
            </span>
          </div>
        </form>
      </div>);
  }
}

export default App;
