import { EventEmitter } from 'events';
import { FETCH_DATA, FILTER_DATA } from '../actions/types';
import dispatcher from '../dispatcher';


class MapStore extends EventEmitter {
  constructor() {
    super();

      this.meteorites = [];
  }

  getAll() {
    return this.meteorites;
  }

  getDataFields() {
    if (this.meteorites.length === 0) return [];

    const dataFields = Object.keys(this.meteorites[0]);
    return dataFields;
  }

  // pushes data into this.meteorites
  addData(data) {
    this.meteorites = data;
    this.emit('change');
  }

  filterData(value, dataType) {
    if (!value) return [];

    var data = this[dataType];
    var filtered = data.filter(d => {
      return d[value];
    });

    this[dataType] = filtered;

    this.emit('change');
  }

  handleActions(action) {
    switch(action.type) {
      case FETCH_DATA:
        this.addData(action.payload);
        break;
      case FILTER_DATA:
        this.filterData(action.payload, action.dataType);
        break;
    }
  }
}

const mapStore = new MapStore;
dispatcher.register(mapStore.handleActions.bind(mapStore));

export default mapStore;
