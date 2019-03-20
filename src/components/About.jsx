/**
 * geoplumber R package code.
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import marked from 'marked'

class About extends React.Component {
    constructor (props) {
        super (props)
        this.state = {

        }
    }
    componentWillMount() {
        const readmePath = require('../about.md')
        fetch(readmePath) 
          .then(response => {
              return response.text()
          })
          .then(text => {
              this.setState({
                  markdown: marked(text)
              })
          })
    }

    render () {
        const { markdown } = this.state
        return (
            <section style={{padding: '5%'}}>
                <article dangerouslySetInnerHTML={{__html: markdown}}></article>
            </section>
        )
    }
}

// thanks to https://stackoverflow.com/a/42124328/2332101
export default withRouter(About);
