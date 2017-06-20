import React, { Component } from 'react';
import Slider from 'rc-slider';
import { Resizable, ResizableBox } from 'react-resizable';

import MapStore from '../stores/MapStore';
import Utils from '../Utils.js'
import * as ViewActions from '../actions/index';
import 'rc-slider/assets/index.css';

import DataMap from './DataMap';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export default class App extends Component {
  constructor() {
    super();
    this.updateData = this.updateData.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onHitEnter = this.onHitEnter.bind(this);
    this.getState = this.getState.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleControlPanel = this.toggleControlPanel.bind(this);

    this.state = this.getState();
  }

  getState () {
    return {
      meteorites: MapStore.getAll(),
      massSizeRange: [0, 100],
      massScaler: "50",
      yearRange: [0, 100],
      citySearched: '',
      isMapLoading: false,
      hasSearched: false,
      showControls: true
    };
  }

  componentWillMount() {
    ViewActions.fetchData();

    MapStore.on('change', this.updateData);
  }

  componentWillUnmount() {
    MapStore.removeListener('change', this.updateData);
  }

  onInputChange(e) {
    this.setState({ 
      isMapLoading: true,
      [e.target.name]: e.target.value 
    });
  }

  onSearchChange(e) {
    this.setState({ 
      hasSearched: false,
      [e.target.name]: e.target.value 
    });
  }

  onSearchClick() {
    this.setState({
      hasSearched: false
    });
  }

  onRangeChange (name, value) {
    this.setState({
      hasSearched: true,
      isMapLoading: true,
      [name]: value
    });
  }

 onHitEnter (e) {
  if (e.charCode === 13) {
    this.setState({
      hasSearched: true,
      isMapLoading: true
    });
  }
 }

  toggleControlPanel(e, data) {
      this.setState({
        showControls: !this.state.showControls
      });
  }

  updateData() {
      this.setState({
        meteorites: MapStore.getAll()
      });
  }

  reset () {
    this.setState(this.getState());
    this.setState({isMapLoading: true});
  }

  render() {
    const {citySearched, hasSearched, isMapLoading, massScaler, massSizeRange, 
         meteorites, showControls, yearRange} = this.state;

    const controls = {
      massScaler: massScaler,
      massSizeRange: massSizeRange,
      yearRange: yearRange,
      citySearched: citySearched
    }

    const searchClass = hasSearched ? "city-search-input-inactive" : "city-search-input-active";

    return (
      <div className="content-container">
      {showControls ? 
      <ResizableBox className="box map-controls" width={170} axis="x">
        <div className="control-group">
          <h1>City</h1>
          <input type="text" 
                 className={searchClass} 
                 name="citySearched" 
                 value={citySearched} 
                 onKeyPress={this.onHitEnter} 
                 onChange={this.onSearchChange} 
                 onClick={this.onSearchClick} 
                 placeholder="Hit enter to search" />
        </div>

        <div className="control-group">
          <h1>Mass Size</h1>
          <span className="range-container">
            <p>1 kg</p>
            <p>2.3e7 kg</p>
          </span>
          <Range tipFormatter={value => `${Utils.denormalizeMassValue(value, 0, 24.455130525381186)}`} 
                 allowCross={false} 
                 name="hello"
                 defaultValue={[0, 100]} 
                 value={[massSizeRange[0], massSizeRange[1]]} 
                 onChange={this.onRangeChange.bind(this, 'massSizeRange')}  
                 pushable={true} />
        </div>

        <div className="control-group">
          <h1>Time Range</h1>
          <span className="range-container">
            <p>Year 861</p>
            <p>Year 2013</p>
          </span>
          <Range tipFormatter={value => `${Utils.denormalizeValue(value, 861, 2013)}`} 
                 value={[yearRange[0], yearRange[1]]} 
                 allowCross={false} 
                 defaultValue={[0, 100]} 
                 onChange={this.onRangeChange.bind(this, 'yearRange')} />
        </div>

        <div className="control-group">
          <h1>Mass Scaler</h1>
           <p className="input-label">{massScaler}x</p>
          <input type="range" min="0" max="100" step="1" name="massScaler" 
                 value={massScaler} 
                 onChange={this.onInputChange} />
        </div>

        <div className="control-group">
          <button className="reset-btn" onClick={this.reset}>Reset Defaults</button> 
          <span className="toggle-controls-btn" 
                onClick={this.toggleControlPanel}>
                <i className="fa fa-sliders"></i>
          </span> 
        </div>
      </ResizableBox> : <span className="toggle-controls-btn" onClick={this.toggleControlPanel}><i className="fa fa-sliders"></i></span> }
      
      <div className="map-container">
        <div className="header">METEORITE LANDINGS</div>
          {
            meteorites.length === 0 ? 
            <div className="loading-gif"></div> : 
            <DataMap controls={controls} 
                     data={meteorites} 
                     isMapLoading={isMapLoading} />
          }
        </div>
      </div>
    );
  }
}
