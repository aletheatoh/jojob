import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend'
import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

class DragAroundCustomDragLayer extends Component {
	constructor(props) {
		super(props)

		this.handleSnapToGridAfterDropChange = this.handleSnapToGridAfterDropChange.bind(
			this,
		)
		this.handleSnapToGridWhileDraggingChange = this.handleSnapToGridWhileDraggingChange.bind(
			this,
		)

		this.state = {
			snapToGridAfterDrop: false,
			snapToGridWhileDragging: false,
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
				 title: this.props.title
			 });
		 }
	 }
 }

	render() {
		const { snapToGridAfterDrop, snapToGridWhileDragging } = this.state

		return (
			<div style={{display: 'inline-block', marginLeft: 50}}>
				<h3>{this.state.title}</h3>
				<Container snapToGrid={snapToGridAfterDrop} logs={this.state.logs}/>
				<CustomDragLayer snapToGrid={snapToGridWhileDragging} />
				<p style={{textAlign: 'center', paddingTop: 2}}><b>Entrance</b></p>
				<p style={{textAlign: 'center', paddingTop: 3}}>
					<label htmlFor="snapToGridWhileDragging">
						<input
							id="snapToGridWhileDragging"
							type="checkbox"
							checked={snapToGridWhileDragging}
							onChange={this.handleSnapToGridWhileDraggingChange}
						/>
						<small>Snap to grid while dragging</small>
					</label>
					<br />
					<label htmlFor="snapToGridAfterDrop">
						<input
							id="snapToGridAfterDrop"
							type="checkbox"
							checked={snapToGridAfterDrop}
							onChange={this.handleSnapToGridAfterDropChange}
						/>
						<small>Snap to grid after drop</small>
					</label>
				</p>
			</div>
		)
	}

	handleSnapToGridAfterDropChange() {
		this.setState({
			snapToGridAfterDrop: !this.state.snapToGridAfterDrop,
		})
	}

	handleSnapToGridWhileDraggingChange() {
		this.setState({
			snapToGridWhileDragging: !this.state.snapToGridWhileDragging,
		})
	}
}

DragAroundCustomDragLayer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DragDropContext(HTML5Backend)(DragAroundCustomDragLayer);
