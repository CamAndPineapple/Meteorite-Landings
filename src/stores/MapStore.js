import { EventEmitter } from 'events';
import { FETCH_DATA } from '../actions/types';
import dispatcher from '../dispatcher';


class MapStore extends EventEmitter {
  constructor() {
    super();

    this.meteorites = [];

  }


  getAll() {
    return this.meteorites;
  }


  // pushes data into this.meteorites
  addData(data) {

    this.meteorites.push(data);
    this.emit('change');
  }

  handleActions(action) {
    switch(action.type) {
      case FETCH_DATA:
        this.addData(action.payload);
    }
  }
}

const mapStore = new MapStore;
dispatcher.register(mapStore.handleActions.bind(mapStore));

export default mapStore;
