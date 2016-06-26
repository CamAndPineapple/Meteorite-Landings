import React, {Component} from 'react';
import Datamap from 'datamaps';

import {FETCH_DATA} from '../actions/types';
import MapStore from '../stores/MapStore';
import dispatcher from '../dispatcher';
import * as ViewActions from '../actions/index';

export default class DataMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data
        }

    }

    componentDidMount() {

        var {data} = this.state;

        var cleanedData = data.filter(d => {
            return d.mass < 3000;
        });


        var createBubbles = cleanedData.map(d => {

            var bubbleColors = ['red', 'green', 'blue', 'purple'];

            return {
                name: d.name,
                radius: d.mass/200,
                city: d.name,
                date: d.year,
                latitude: d.reclat,
                longitude: d.reclong,
                fillKey: bubbleColors[Math.floor(Math.random() * 4)]
            };
        });


        var map = new Datamap({
            element: this.mapNode,
            geographyConfig: {
                popupOnHover: false,
                highlightOnHover: false
            },
            fills: {
                defaultFill: '#ABDDA4',
                red: 'red',
                blue: 'blue',
                green: 'green',
                purple: 'purple'
            }
        });
            map.bubbles(createBubbles);
    }

    render() {




        return (
            <div className="datamap-container">
                <div className="datamap" ref={ref => this.mapNode = ref}/>
            </div>
        );
    }
}
