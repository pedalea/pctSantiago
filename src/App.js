/**
 * geoplumber R package code.
 */
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from './Welcome';
import Header from './components/Header';
import DynamicImport from './components/DynamicImport';
import About from './components/About'

import './App.css';

/**
 * Code splitting.
 * @param {*} props 
 */
const Deck = (props) => (
  <DynamicImport load={() => import('./Deck')}>
    {
      (Component) => Component === null
      ? <div className="loader" style={{ zIndex: 999}} />
      : <Component {...props} />
    }
  </DynamicImport>
)

/**
 * Separate the Header and the main content.
 * Up to this point we are still not using SSR
 */
class App extends Component {
  render() {
    return (
      <main>
        <Header />
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/about" component={About} />
          <Route path="/deck" component={Deck} />
        </Switch>
      </main>
    )
  }
}

export default App;
