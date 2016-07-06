import React, {Component} from 'react';
import Datamap from 'datamaps';
import moment from 'moment';

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
        const massScaler = 5000;

        // max = 23,000,000
        // min = 0.15

        var cleanedData = data.filter(d => {
            return d.mass < 200000;
        });

        var createBubbles = cleanedData.map(d => {

            var bubbleColors = ['red', 'orange', 'blue', 'purple'];


            return {
                name: d.name,
                radius: d.mass/massScaler,
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
                popupOnHover: true,
                highlightOnHover: true
            },
            fills: {
                defaultFill: '#39DCB4',
                red: 'red',
                blue: 'blue',
                orange: 'orange',
                purple: 'purple'
            }
        });
            map.bubbles(createBubbles, {
                popupTemplate: function(geo, data) {

                    return (
                        `<div class="hover-info">
                            <ul>
                                <li>City: ${data.city}</li>
                                <li>Year: ${moment(data.date).format('YYYY')}</li>
                                <li class="info-mass">Mass: ${data.radius*massScaler/1000} kilograms</li>
                            </ul>
                        </div>`
                    );
                }
            });
    }

    render() {




        return (
            <div className="datamap-container">
                <div className="datamap" ref={ref => this.mapNode = ref}/>
            </div>
        );
    }
}
