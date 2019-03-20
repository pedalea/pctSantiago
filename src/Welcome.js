/**
 * ATFutures, LIDA/ITS, University of Leeds
 * Entry component for ATT
 */
import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import Control from 'react-leaflet-control';

import GeoJSONComponent from './components/GeoJSONComponent.jsx';
import RBSidebar from './components/RBSidebar';
import TilesBasemap from './components/TilesBasemap';
import Constants from './Constants';

import {
    getResultsFromGoogleMaps
} from './Util';

import './App.css';
const url = (process.env.NODE_ENV === 'development' ? Constants.DEV_URL : Constants.PRD_URL);

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sfParam: null,
            map: null,
            baseURL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        }
    }

    componentDidMount() {
        const map = this.refs.map.leafletElement
        // add the scale here
        L.control.scale().addTo(map)
        this.setState({ map })
    }

    render() {
        const { center } = this.state;
        return (
            <Map
                preferCanvas={true}
                zoom={13}
                ref='map'
                center={center ? center :[53.8008, -1.5491]}
                onclick={(e) => {
                    this.setState({ touchReceived: true })
                }}
            >
                {
                    this.state.baseURL.includes("google") ?
                        <TileLayer
                            key={this.state.baseURL}
                            url={this.state.baseURL}
                            attribution={this.state.attribution}
                            maxZoom={this.state.maxZoom}
                            subdomains={this.state.subdomains}
                        /> :
                        <TileLayer
                            url={this.state.baseURL}
                            attribution={this.state.attribution}
                        />

                }

                <RBSidebar
                    map = {this.state.map}
                    styles={{ backgroundColor: 'black' }}
                    searchCallback={(search) => {
                        getResultsFromGoogleMaps(search, (result) => {
                            console.log(result)
                            //if no results
                            if (typeof (result.lat) === 'number' &&
                                typeof (result.lng) === 'number') {
                                // history.push(`/?lat=${result.lat.toFixed(3)}&lng=${result.lng.toFixed(3)}&zoom=${zoom}`)

                                this.setState({
                                    center: [result.lat, result.lng]
                                })
                            }//die happily
                        })
                    }}
                    onChange={value => {
                        //resize zones
                    }}
                />
                <TilesBasemap
                    returnSourceURL={(base) => this.setState({
                        baseURL: base.url,
                        attribution: base.attribution,
                        maxZoom: base.maxZoom,
                        subdomains: base.subdomains
                    })}
                />
                                <GeoJSONComponent 
                map = {this.state.map}
                style={{
                    fillColor: undefined,
                    weight: 'flow',
                    color: 'O'
                }}
                fetchURL= {url + "/api/getbb"} />
                
                <Control position="bottomright">
                    <p style={{
                        padding: '3px',
                        backgroundColor: 'white'
                        }}>
                        Legend: !!
                    </p>
                </Control>
                {/* #ADD_COMPONENT */}
            </Map>
        );
    }
}

