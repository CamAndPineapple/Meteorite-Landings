import React from 'react';
import {Component} from 'react';
import {FETCH_DATA} from '../actions/types';
import MapStore from '../stores/MapStore';
import dispatcher from '../dispatcher';
import * as MapActions from '../actions/index';


export default class App extends Component {
  constructor() {
    super();
    this.updateData = this.updateData.bind(this);

    this.state = {
      meteorites: MapStore.getAll()
    }
  }

  componentWillMount() {
    this.fetchData();
    // if change event was emitted, re-render component
    MapStore.on('change', this.updateData);

  }

  fetchData() {
    MapActions.fetchData();
  }

  componentWillUnmount() {
    MapStore.removeListener('change', this.updateData);
  }

  updateData() {
    this.setState({
      meteorites: MapStore.getAll()
    });
  }

  render() {

    console.log("state", this.state.meteorites);

    return (
      <div>Meteorite Landings</div>
    );
  }
}
