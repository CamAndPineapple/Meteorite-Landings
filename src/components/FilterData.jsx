import React, { Component } from 'react';

// User enters the param they want to see
// Input updates the store

import * as ViewActions from '../actions/index';

export default class FilterData extends Component {

  constructor() {
    super();

    this.state = {
      value: ''
    }

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);

  }

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  onClick(e) {
    e.preventDefault();
    var {value} = this.state;
    var input = value.toString();

    if (this.props.dataFields.indexOf(input) === -1) {
        alert("that value doesn't exist in the dataset");
    } else {
      ViewActions.filterData(input);
    }

  }

  render () {

    return (
      <form>
        <input onChange={this.onChange} />
        <button className="btn btn-primary" onClick={this.onClick}>Update</button>
      </form>
    );
  }
}
