import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'

import shallowEqual from 'shallowequal'

const styles = {
	border: '1px solid black',
	padding: '0.5rem 1rem',
	cursor: 'move',
}

class Box extends Component {

	// shouldComponentUpdate = shouldPureComponentUpdate
	shouldPureComponentUpdate(nextProps, nextState) {
		!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
	}

	render() {
		const { title, yellow } = this.props
		const backgroundColor = yellow ? 'yellow' : 'white'

		return <div style={{ border: '1px solid black', padding: '0.5rem 1rem', cursor: 'move', backgroundColor }}>{title}</div>
	}
}

Box.propTypes = {
	title: PropTypes.string.isRequired,
	yellow: PropTypes.bool,
};

export default Box;
