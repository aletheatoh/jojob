import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { DropTarget } from 'react-dnd'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'
import ItemTypes from './ItemTypes'
import DraggableBox from './DraggableBox'
import snapToGrid from './snapToGrid'

import shallowEqual from 'shallowequal'

const styles = {
	width: 300,
	height: 300,
	border: '1px solid black',
	position: 'relative',
	margin: '0 auto',
	paddingTop: 10
}

const boxTarget = {
	drop(props, monitor, component) {
		const delta = monitor.getDifferenceFromInitialOffset()
		const item = monitor.getItem()

		let left = Math.round(item.left + delta.x)
		let top = Math.round(item.top + delta.y)
		if (props.snapToGrid) {
			;[left, top] = snapToGrid(left, top)
		}

		component.moveBox(item.id, left, top)
	},
}

function collect(connect) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget()
  };
}

function getBoxes(logs) {
	var boxes = {};
	var alph = ['a', 'b', 'c', 'd'];
	logs.map(function(log, index){
		boxes[alph[index]] = {
			top: 10,
			bottom: 50,
			title: log.name
		}
	})

	return boxes;
}

class Container extends Component {

	// shouldComponentUpdate = shouldPureComponentUpdate
	shouldPureComponentUpdate(nextProps, nextState) {
		!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
	}

	constructor(props) {
		super(props)
		this.state = {
			boxes: {
				a: {top: 20, left: 50, title: 'title'}
			},
			alreadyUpdated: false
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	 // If we have a snapshot value, we've just added new items.
	 // Adjust scroll so these new items don't push the old ones out of view.
	 // (snapshot here is the value returned from getSnapshotBeforeUpdate)
	 if (snapshot !== null) {
		 if (this.state.alreadyUpdated === false) {
			 this.setState({alreadyUpdated: true});
			 this.setState({
				 logs: this.props.logs,
				 boxes: getBoxes(this.props.logs)
			  });
			 console.log("received props again: " + this.props.logs)
		 }
	 }
 }

	moveBox(id, left, top) {
		this.setState(
			update(this.state, {
				boxes: {
					[id]: {
						$merge: { left, top },
					},
				},
			}),
		)
	}

	renderBox(item, key) {
		return <DraggableBox key={key} id={key} {...item} />
	}

	render() {
		const { connectDropTarget } = this.props
		const { boxes } = this.state

		return connectDropTarget(
			<div style={styles}>
				{Object.keys(boxes).map(key => this.renderBox(boxes[key], key))}
			</div>,
		)
	}
}

Container.propTypes = {
	connectDropTarget: PropTypes.func.isRequired,
	snapToGrid: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(Container);
