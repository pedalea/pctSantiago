'use-strict'

import React, { Component } from 'react';
import Control from 'react-leaflet-control';

import RBSlider from './RBSlider';

const SLIDER_MIN = 1
const SLIDER_MAX = 40

export default class RBSidebar extends Component {  // note we're extending MapControl from react-leaflet, not Component from react

    constructor(props) {
        super(props);
        this.state = {
            display: props.visible ? props.visible : "none",
        }
        this._showSearchBar = this._showSearchBar.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // console.log(props.selectedValues);
        
        if (props.visible && props.visible !== state.visible) {            
            return { 
                display: props.visible,
                ...props.selectedValues
             }
        }
        return null
    }

    _handleChange(e) {
        e.preventDefault();
        // console.log(e.target.value);
        this.setState({ search: e.target.value })
    }

    _handleKeyPress(e) {
        // console.log(e.key);
        if (e.key === 'Enter') {
            const { searchCallback } = this.props;
            if (typeof (searchCallback) === 'function') {
                searchCallback(this.state.search)
            }
        }
    }

    /**
     * Multiple use do not undo refactoring.
     * 
     */
    _showSearchBar() {
        return (
            <input
                autoFocus
                onChange={this._handleChange.bind(this)}
                onKeyPress={this._handleKeyPress.bind(this)}
                className="attsearchinput" type='text' placeholder='Search...' />
        )
    }

    _content() {
        return (
            <div 
            className="right-sidebar-expanded"
            style={{
                minWidth: '200px'
            }}>
            </div>
        )
    }
    
    render() {
        const { display } = this.state;
        const { map } = this.props;
        const isVisible = display === "block";
        return (
            <Control position="topright">
                <div
                    onMouseEnter={() => {
                        map && map.scrollWheelZoom.disable()
                    }}
                    onMouseLeave={() => {
                        map && map.scrollWheelZoom.enable()
                    }}
                    className="attsidebar">
                    {
                        !isVisible &&
                        <div className="menuAndInput">
                            <button
                                style={{
                                    marginRight: '5px',
                                    display: display === "none" ? "block" : "none"
                                }}
                                onClick={(event) => {
                                    const newState = display === "none" ? "block" : "none"
                                    this.setState({
                                        display: newState
                                    })
                                    //safely check
                                    if (this.props.visibilityToggled && typeof (this.props.visibilityToggled === 'function')) {
                                        this.props.visibilityToggled(newState);
                                    }
                                }}
                            >&#9776;</button>
                            {this._showSearchBar()}
                        </div>
                    }

                    <div
                        id="right-sidebar"
                        style={{
                            borderRadius: '7px',
                            transition: 'all 0.9s',
                            WebkitTransition: 'all 3s',
                            backgroundColor: "white",
                            padding: '10px',
                            display: this.state.display
                        }}>
                        <div
                            style={{ padding: 0 }}
                            className="menuAndInput">
                            <button
                                style={{ marginRight: '5px' }}
                                onClick={(event) => {
                                    this.setState({
                                        display: this.state.display === "none" ? "block" : "none"
                                    })
                                }}
                            >X</button> {this._showSearchBar()}
                        </div>
                        <hr />
                        {this._content()}
                    </div>
                </div>
            </Control>
        )
    }
}