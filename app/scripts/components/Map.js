import React from "react";
import d3 from "d3";
import topojson from "topojson";

export default class Map extends React.Component {

	componentDidMount() {

		this.width = 960;
		this.height = 560;

		var svg = d3.select( ".map-wrapper" )
			.append( "svg" )
				.attr( "width", "100%" )
				.attr( "height", "100%" ),
			wrapper = svg.append( "g" )
						.attr( "class", "wrapper" )
						.attr( "transform", "translate(0,0)" );

		d3.json( "data/world.json", ( error, geom ) => {

			if( error ) {
				return console.error( error );
			}

			let countries = topojson.feature( geom, geom.objects.world ).features;

			this.projection = d3.geo.conicConformal();
			this.path = d3.geo.path().projection( this.projection );

			this.countriesPath = svg.selectAll( "path.countries" ).data( countries );

			let graticule = d3.geo.graticule();
			this.graticulePath = svg.append( "path" ).datum( graticule ).attr( "class", "graticule" );

			//enter phase
			this.countriesPathEnter = this.countriesPath.enter()
										.append( "path" )
										.attr( "class", "countries" );

			this.reproject();
			this.redraw();

		} );

	}

	reproject() {

		if( this.projection ) {
			this.projection
				.rotate( [ this.props.rotateX, this.props.rotateY ] )
				.center( [ this.props.centerX, this.props.centerY ] )
				.parallels( [ this.props.parallel1, this.props.parallel2 ] )
				.scale( this.width/this.props.scale )
				.translate([ this.width / 2, this.height / 2]);
		}

	}

	redraw() {

		if( this.path ) {
			//update phase
			this.countriesPath.attr( "d", this.path );
			this.graticulePath.attr( "d", this.path );
		}
		
	}

	render() {

		this.reproject();
		this.redraw();
		
		return (
			<div className="map-wrapper"></div>
		);

	}

}

Map.defaultProps = { rotateX: -25, rotateY: 0, center: [ 0, 0 ], parallels: [ 30, -20], scale: 3 };