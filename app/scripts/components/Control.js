import React from "react";

export default class Control extends React.Component {

	constructor() {

		super()
		this.isMouseDown = false;
		this.oldX = 0;
		this.mouseMoveHandler = this.onMouseMove.bind( this );
		this.mouseUpHandler = this.onMouseUp.bind( this );

	}

	onMouseDown( evt ) {

		this.isMouseDown = true;
		this.oldX = evt.clientX;
		window.addEventListener( "mousemove" , this.mouseMoveHandler );
		window.addEventListener( "mouseup" , this.mouseUpHandler  );

	}

	onMouseMove( evt ) {
		
		if( this.isMouseDown ) {
			
			var nowX = evt.clientX,
				diffX = (nowX - this.oldX),
				range = this.props.max - this.props.min,
				changePerPx = range/1000,
				inputNode = this.refs.input.getDOMNode(),
				newValue = this.props.value + diffX*changePerPx;

			//enforce bounds
			newValue = Math.min( newValue, this.props.max );
			newValue = Math.max( newValue, this.props.min );

			this.oldX = nowX;
			this.props.onChange( this.props.name, newValue );

		}

	}

	onMouseUp( evt ) {
		
		this.isMouseDown = false;
		window.removeEventListener( "mousemove" , this.mouseMoveHandler );
		window.removeEventListener( "mouseup" , this.mouseUpHandler );
	
	}

	render() {

		return (
			<li className="control" onMouseDown={this.onMouseDown.bind(this)}>
				<label>
					<span className="control-value">{Math.round(this.props.value)}</span>
					<i className="fa fa-arrows-h"></i>
					<span className="control-name">{this.props.label}</span>
					<input ref="input" {... this.props} type="range" />
				</label>
			</li>
			);
	
	}

}