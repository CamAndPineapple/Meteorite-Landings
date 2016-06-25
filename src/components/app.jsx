import React, { Component } from 'react';

import {FETCH_DATA} from '../actions/types';
import MapStore from '../stores/MapStore';
import dispatcher from '../dispatcher';
import * as ViewActions from '../actions/index';

import FilterData from './FilterData';
import MeteoriteGroup from './MeteoriteGroup';

export default class App extends Component {
  constructor() {
    super();
    this.updateData = this.updateData.bind(this);

    this.state = {
      meteorites: MapStore.getAll(),
      dataFields: MapStore.getDataFields()
    }
  }

  componentWillMount() {
    ViewActions.fetchData();

    MapStore.on('change', this.updateData);
  }

  componentWillUnmount() {
    MapStore.removeListener('change', this.updateData);
  }

  updateData() {
    this.setState({
      meteorites: MapStore.getAll(),
      dataFields: MapStore.getDataFields(),
    });
  }

  render() {
    var {dataFields, meteorites} = this.state;

    return (
      <div>
        <div>Meteorite Landings</div>
        <FilterData dataFields={dataFields} />
        <MeteoriteGroup meteorites={meteorites} />
      </div>
    );
  }
}
