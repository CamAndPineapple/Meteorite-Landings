import dispatcher from '../dispatcher';
import axios from 'axios';
import { FETCH_DATA, FILTER_DATA } from './types';
import { API_ENDPOINT } from '../config';


export function fetchData() {
  axios.get(API_ENDPOINT).then(data => {
    dispatcher.dispatch({
      type: FETCH_DATA,
      payload: data.data
    });
  }).catch(err => console.log(err));
}

export function filterData(value) {
    dispatcher.dispatch({
      type: FILTER_DATA,
      payload: value
    });
}
