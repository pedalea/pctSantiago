import React from 'react';
import DeckGL, { GeoJsonLayer, FirstPersonView, ArcLayer } from 'deck.gl';
import { StaticMap, NavigationControl } from 'react-map-gl';

import { fetchData } from './Util';
import Constants from './Constants';
import RBSlider from './components/RBSlider';

import './App.css';

const url = (process.env.NODE_ENV === 'development' ? Constants.DEV_URL : Constants.PRD_URL);

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGF5aWsiLCJhIjoiY2ppNXFndGNzMGtpaDNxbXNqd2Rqc3BqZyJ9.355os6YWhIKPVaSiX01QIA';
const SLIDER_MIN = 1
const SLIDER_MAX = 40
const FLOW_BATCH = 25

// Initial viewport settings
const initialViewState = {
    longitude: 170.6362,
    latitude: -44.1321,
    zoom: 6,
    pitch: 55,
    bearing: 0
};
const gradient = {
    height: '200px',
    // TODO: which browsers?
    backgroundColor: 'red', /* For browsers that do not support gradients */
    backgroundImage: 'linear-gradient(to top, red , yellow)' /* Standard syntax (must be last) */
}
// Data to be used by the LineLayer
// const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layers: [],
            backgroundImage: gradient.backgroundImage
        }
        this._recalculateLayers = this._recalculateLayers.bind(this)
    }

    componentDidMount() {
        fetchData(url + "/api/flow", (data, error) => {
            if (!error) {
                // console.log(data.features);
                let backgroundImage = gradient.backgroundImage;
                // min max
                let min = 0, max = 0;
                data.features.forEach((d, index) => {
                    if(index === 0) {
                        //'linear-gradient(to top, red , yellow)'
                        backgroundImage = backgroundImage.replace("red",
                        'rgb(' + d.properties.O + ',' + (d.properties.O - 100) + ',240)'
                        )
                    }
                    if((index + 1) === data.features.length) {
                        backgroundImage = backgroundImage.replace("yellow",
                        'rgb(' + d.properties.O + ',' + (d.properties.O - 100) + ',240)'
                        )
                    }
                    const flow = Number.parseFloat(d.properties.flow).toFixed(2)
                    if(min === 0 && max === 0) {
                        min = flow;
                        max = min
                    } else {
                        if(flow > max) {
                            max = flow
                        }
                        if(flow < min) {
                            min = flow
                        }
                    }
                })
                
                this.setState({
                    data:data,
                    backgroundImage,
                    min, max,
                })
                this._recalculateLayers()
            } else {
                //network error?
            }
        })
    }

    _recalculateLayers(filter) {

        let {data} = this.state;
        if(!data) return;
        if(filter) {
            data = data.features.slice(0, (filter * FLOW_BATCH))
        }
        
        const arcLayer = new ArcLayer({
            id: 'arc-layer',
            data: filter ? data : data.features,
            pickable: true,
            getStrokeWidth: d => d.properties.flow + 2,
            getSourcePosition: d => d.geometry.coordinates[0],
            getTargetPosition: d => d.geometry.coordinates[1],
            getSourceColor: d => [d.properties.O, d.properties.O - 100, 240],
            getTargetColor: d => [d.properties.D, d.properties.D - 100, 240],
            // onHover: ({object}) => setTooltip(`${object.from.name} to ${object.to.name}`)
          })
        const gjLayer = new GeoJsonLayer({
            id: 'geojson-layer',
            data: filter ? data : data.features,
            pickable: true,
            stroked: false,
            filled: true,
            extruded: true,
            lineWidthScale: 20,
            lineWidthMinPixels: 2,
            // getFillColor: [160, 160, 180, 200],
            getLineColor: d => [d.properties.O, d.properties.O - 100, 240],
            getRadius: 100,
            getLineWidth: d => d.properties.flow,
            getElevation: 30,
            // onHover: ({ object }) => setTooltip(object.properties.name || object.properties.station)
        });
        this.setState({layers: [arcLayer], gjLayer, 
            arcCount: filter ? data.length : data.features.length})
    }
    render() {
        // console.log(this.state.max)
        let backgroundImage = this.state.backgroundImage
        return (
            <DeckGL
                initialViewState={initialViewState}
                controller={true}
                layers={this.state.layers}
                onViewportChange={viewport => this.setState({ viewport })}
            >
                <StaticMap
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
                <FirstPersonView width="50%" x="50%" fovy={50} />
                {/* <div className="mapbox-legend">
                    <h4>Flow</h4>
                    <div style={{
                        height: gradient.height,
                        backgroundColor: gradient.backgroundColor,
                        backgroundImage
                    }}/>
                </div> */}
                <div className='mapbox-legend' style={{
                    zIndex: 9999, top:54, maxHeight:100}}>
                    <RBSlider 
                        min={SLIDER_MIN}
                        max={SLIDER_MAX}
                        value={SLIDER_MAX}
                        pure={true}
                        onChange={(value) => this._recalculateLayers(value)}
                    />
                    <h5>Showing {this.state.arcCount} flows.</h5>
                </div>
            </DeckGL>
        );
    }
}