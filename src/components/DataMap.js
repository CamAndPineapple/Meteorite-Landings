import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Datamap from 'datamaps';
import moment from 'moment';

import Utils from '../Utils';

export default class DataMap extends Component {
    constructor (props) {
        super(props);

        this.map = null;
        this.createBubbles = null;
        this.updateMapData = this.updateMapData.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
        this.setZoom = this.setZoom.bind(this);

        this.state = {
            data: this.props.data
        };
    }

    componentDidMount () {
        let comp = this;
        this.map = new Datamap({
            element: this.mapNode,
            geographyConfig: {
                popupOnHover: true,
                highlightOnHover: true
            },
            fills: {
                defaultFill: '#39DCB4',
                purple: '#c08fff'
            },
            responsive: true,
            done: function(datamap) {
                datamap.svg.call(d3.behavior.zoom().on("zoom", () => comp.setZoom()));
                comp.props.whenLoaded();
            }
        });

        window.addEventListener("resize", () => this.map.resize());
        this.updateMapData(this.state.data);
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (!nextProps.isMapLoading) return false;
        return true;
    }

    isWithinRange (val, controlType) {
        let controlValue = this.props.controls[controlType];
        let min = controlValue[0]/100;
        let max = controlValue[1]/100;

        return val >= min && val <= max;
    }

    checkCitySearch (city) {
        const {citySearched} = this.props.controls;
        if (!citySearched) return true;

        return city.includes(citySearched);
    }

    updateMapData (data, sizeRange) {
        let dataExtended = data.filter(d => {
            d.value = +d.mass;
            d.dateYear = new Date(d.year).getFullYear();
            if (Math.log2(d.value) >= 0) {
                d.log2Mass = Math.log2(d.value);
                return true;
            }

            return false;
        });

        const massRange = Utils.getMinMax(dataExtended, 'value');
        const yearRange = Utils.getMinMax(dataExtended, 'dateYear');
        const log2MassRange = Utils.getMinMax(dataExtended, 'log2Mass');

        let filteredByRange = dataExtended.filter(d => {
            d.dateNormal = Utils.normalize(d.dateYear, yearRange.min, yearRange.max);
            d.massNormal = Utils.normalize(d.value, massRange.min, massRange.max);
            d.logMassNormal = Utils.normalize(d.log2Mass, log2MassRange.min, log2MassRange.max);

            if (this.isWithinRange(d.logMassNormal, 'massSizeRange') && 
                this.isWithinRange(d.dateNormal, 'yearRange') &&
                this.checkCitySearch(d.name)) {
                return true;
            }

            return false; 
        });

        this.createBubbles = filteredByRange.map(d => {
            const {massScaler} = this.props.controls;
           
            return {
                name: d.name,
                radius: Math.pow(massScaler, d.logMassNormal),
                mass: d.mass,
                city: d.name,
                date: d.year,
                dateYear: new Date(d.year).getFullYear(),
                latitude: d.reclat,
                longitude: d.reclong,
                fillKey: 'purple' 
            };
        });

        this.populateMap();
    }

    populateMap () {
        this.map.bubbles(this.createBubbles, {
            popupTemplate: function(geo, data) {

                const massRounded = Math.round(+data.mass);
                const massCommaSeparated = massRounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                return (
                    `<div class="hover-info">
                        <ul>
                            <li>City: ${data.city}</li>
                            <li>Year: ${moment(data.date).format('YYYY')}</li>
                            <li class="info-mass">Mass: ${massCommaSeparated} kilograms</li>
                            <li class="google-link">Click to Google Search</li>
                        </ul>
                    </div>`
                );
            }
        });

        this.map.svg.selectAll('.datamaps-bubble').on('click', function(d) {
            const url = `http://www.google.com/search?q=${d.city}+${d.dateYear}+meteorite`;
            window.open(url);
        });

        // notify app component that map is done loading
        this.map.options.done(this.map);
    }

    setZoom () {
        let translate = d3.event.translate;
        let scale = d3.event.scale;
        this.map.svg.selectAll("g").attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    resetZoom () {
        let zoom = d3.behavior.zoom().translate([0,0]).scale(1);
        this.map.svg.call(zoom.on("zoom", this.setZoom));
        this.map.resize();
    }

    render () {
        let {data} = this.state;
        
        if (this.map !== null) this.updateMapData(data);

        return (
            <div className="datamap-container">
                <div className="datamap" ref={ref => this.mapNode = ref}/>
                <button className="zoom-reset-btn" onClick={this.resetZoom}>Reset Zoom</button>
            </div>
        );
    }
}

DataMap.propTypes = {
    controls: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isMapLoading: PropTypes.bool.isRequired,
    whenLoaded: PropTypes.func.isRequired 
}
