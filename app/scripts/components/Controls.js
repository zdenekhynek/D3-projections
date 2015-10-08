import React from "react";
import Control from "./Control";

export default class Controls extends React.Component {

	constructor() {
		super();
		//http://stackoverflow.com/questions/29732015/value-of-this-in-react-event-handler
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange( propName, propValue ) {
	
		this.props.onControlChange( propName, propValue );
	
	}

	render() {

		return (
			<div className="controls">
				<ul className="clearfix">
					<Control label="Rotate X" name="rotateX" min="-360" max="360" value={this.props.rotateX} onChange={this.handleChange} />
					<Control label="Rotate Y" name="rotateY" min="-360" max="360" value={this.props.rotateY} onChange={this.handleChange} />
					<Control label="Center X" name="centerX" min="-180" max="180" value={this.props.centerX} onChange={this.handleChange} />
					<Control label="Center Y" name="centerY" min="-89" max="89" value={this.props.centerY} onChange={this.handleChange} />
					<Control label="Parallel 1" name="parallel1" min="-89" max="89" value={this.props.parallel1} onChange={this.handleChange} />
					<Control label="Parallel 2" name="parallel2" min="-89" max="89" value={this.props.parallel2} onChange={this.handleChange} />
					<Control label="Scale" name="scale" min="1" max="25" value={this.props.scale} onChange={this.handleChange} />
				</ul>
			</div>
		)

	}

}