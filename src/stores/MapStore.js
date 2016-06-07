import { EventEmitter } from 'events';
import { FETCH_DATA, FILTER_DATA } from '../actions/types';
import dispatcher from '../dispatcher';


class MapStore extends EventEmitter {
  constructor() {
    super();

    this.meteorites = [];

  }

  getAll() {
    // format: [{data}, {data}, {data}]
    return this.meteorites;
  }

  getDataFields() {
    if (this.meteorites.length > 0) {
      return Object.keys(this.meteorites.shift());
    }
  }

  // pushes data into this.meteorites
  addData(data) {
    this.meteorites = data;
    this.emit('change');
  }

  filterData(value) {
    this.meteorites.filter(m => {
      console.log("mvalue", m[value]);
      return m[value];
    });
    this.emit('change');
  }

  handleActions(action) {
    switch(action.type) {
      case FETCH_DATA:
        this.addData(action.payload);
      case FILTER_DATA:
        this.filterData(action.payload);
    }
  }
}

const mapStore = new MapStore;
dispatcher.register(mapStore.handleActions.bind(mapStore));

export default mapStore;
