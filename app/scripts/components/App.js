import React from "react";
import Map from "./Map";
import Controls from "./Controls";

export default class App extends React.Component {

	constructor( props ) {
		super( props );
		this.state = { rotateX: -10, rotateY: 0, centerX: 0, centerY: 45, parallel1: 30, parallel2: -20, scale: 3 };
	}

	onControlChange( propName, propValue ) {
		var newState = {};
		newState[ propName ] = propValue;
		this.setState( newState );
	}

	render() {
		return (
			<div className="page-wrap">
				<div className="page-header clearfix">
					<h1><strong>Lambert conformal</strong> conic projection</h1>
					<Controls {...this.state} onControlChange={ this.onControlChange.bind( this ) } /> 
				</div>
				<div className="page-content">
					<Map {...this.state}/>
				</div>
			</div>
		)

	}

}