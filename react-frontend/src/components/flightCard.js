import React, { Component } from 'react';
import '../App.css';
import moment from 'moment';



class FlightCard extends Component {

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

  }

  handleSelect(flight,e) {
   this.props.clickProp(flight,e);
   console.log(flight,'propFlight');
 }

  render() {
    let flightItem =this.props.flight;
    let flightNumber = flightItem.number;
    const departs = moment(flightItem.departs.when);
    const newDateD = moment(departs).format('LLL');

    return (
      <div className="cardWrapper" onClick={(e)=>this.handleSelect(flightItem,flightNumber,e)}>
      <h1>{this.props.from}> {this.props.to}</h1>
      <h3 className="cost">${this.props.flight.cost}</h3>
      <p>{this.props.airline}</p>
      <p>{newDateD}</p>
      </div>
    );

  }
}

export default FlightCard;
