/**
 * Add features from geojson from a URL to a given map.
 *
 *
 * If the features are points and there are >10 features or circle=true then
 * features are displayed as circleMarkers, else Markers.
 *
 * @param fetchURL default = 'http://localhost:8000/api/data'
 * @param radius default 8
 *
 * geoplumber R package React code.
 */
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

export default class GeoJSONComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geojson: null
        }
        this._fetchData = this._fetchData.bind(this)
    }

    _fetchData() {
        const url = this.props.fetchURL ? this.props.fetchURL : 'http://localhost:8000/api/data'
        console.log("fetching... " + url)
        fetch(url)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then((geojson) => {
                        if ((geojson.features && geojson.features.length === 0) || response.status === 'ZERO_RESULTS') {
                            this.setState({ error: response.status })
                        } else {
                            if(url.endsWith("api/getbb")) {
                                var southWest = L.latLng(geojson[0], geojson[1]),
                                    northEast = L.latLng(geojson[2], geojson[3]),
                                    bounds = L.latLngBounds(southWest, northEast);
                                    this.props.map && this.props.map.fitBounds(bounds)
                            } else {
                                const geojsonLayer = L.geoJson(geojson)
                                const bbox = geojsonLayer.getBounds()                                
                                // assuming parent has provided "map" object
                                this.props.map && this.props.map.fitBounds(bbox)
                            }
                            this.setState({ geojson })
                        }
                    });
            })
            .catch((err) => {
                console.log('Fetch Error: ', err);
            });
    }

    componentDidMount() {
        this._fetchData()
    }

    componentDidUpdate(prevProps, prevState) {        
        if (this.props.fetchURL !== prevProps.fetchURL) {
            this._fetchData()
        }
        if(this.props.radius !== prevProps.radius) {
            this.forceUpdate()
        }
    }

    render() {
        const { geojson } = this.state;
        let { radius } = this.props;
        radius = radius || 8

        if (!geojson) {
            return (null) // as per React docs
        }
        if(!geojson.features || geojson.type !== "FeatureCollection") { 
            if(geojson.coordinates) { //single feature.
                return(
                <GeoJSON
                    key={JSON.stringify(geojson)}
                    data={geojson}
                />
                )
            } else {
                return(null) //nothing is passed to me.
            }
        }
        // we have type: "FeatureCollection"
        console.log(geojson.features.length)
        return (
            geojson.features.map((feature, i) => {
                return (
                    <GeoJSON
                        key={JSON.stringify(feature) + radius}
                        data={feature}
                        onEachFeature={(feature, layer) => {
                            const properties = Object.keys(feature.properties).map((key) => {
                                return ("<tr><td>" + key + "</td><td>" + 
                                Number.parseFloat(feature.properties[key]).toFixed(3) + "</td></tr>")
                            })
                            // console.log(feature.properties)
                            // console.log(properties)
                            layer.bindPopup(
                                "<table><th colspan='2'>Raw data</th>" + properties.join('')
                            );
                        }}
                        pointToLayer={
                            // use cricles prop if not 10 markers is enough                            
                            this.props.circle || geojson.features.length > 10 ?
                                (_, latlng) => {
                                    // Change the values of these options to change the symbol's appearance
                                    let options = {
                                        radius: radius,
                                        fillColor: "green",
                                        color: "black",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8
                                    }
                                    return L.circleMarker(latlng, options);
                                }
                                :
                                (_, latlng) => {
                                    return L.marker(latlng);
                                }
                        }
                    />
                )
            })
        )
    }
}
