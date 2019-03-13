import React, {Component} from 'react';
import './App.css';
import logo from './logo.svg';
import FlightCard from './components/flightCard.js';
import {Modal,Button,Form,Row,Col,Alert} from 'react-bootstrap';
import moment from 'moment';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: false,
      isLoaded: false,
      items: [],
      validated: false,
      number: false,
      flight: {
        "airline": "Mobius Airways",
        "cost": 567.89,
        "departs": {
          "airport": "SFO",
          "when": "2015-01-01T12:00:00"
        },
        "arrives": {
          "airport": "IAH",
          "when": "2015-01-01T16:00:00"
        },
        "number": "MO123"
      },
      confirmation: false,
      confirmationNum: '',
      errorMessage: ''
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);


  }


  componentDidMount() {
    fetch("http://127.0.0.1:5000/flights").then(res => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            items: data
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });

        }
      )
  }

  handleClose(number) {
    this.setState({
      show: false,
      number: false,
    });
  }

  handleShow(flight, number, e) {
    this.setState({
      flight: flight,
      show: true,
      number: [`${number}`],
      errors: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({
      validated: true
    });

    var self = this;

    fetch('http://127.0.0.1:5000/book', {
        method: 'POST',
        body: JSON.stringify({
          first_name: this.state.firstname,
          last_name: this.state.lastname,
          flight_number: this.state.number[0],
          bags: this.state.bags
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(function(response) {
        return response.json()
      }).then(function(body) {
        console.log('body', body);

        if (body.success) {
          self.setState({
            firstname: undefined,
            lastname: undefined,
            number: undefined,
            show: false,
            errors: false,
            confirmation: true,
            confirmationNum: body.confirmation
          })
        } else {
          console.log(body.message);
          console.log(self.state);
          self.setState({
            errors: true,
            errorMessage: body.message
          })
        }

      });


  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    console.log(this.state, 'state change');
  }

  render() {
      const {
        validated
      } = this.state;
      const {
        error,
        isLoaded,
        items
      } = this.state;
      const flightPicked = this.state.flight;
      const arrives = moment(flightPicked.arrives.when);
      const departs = moment(flightPicked.departs.when);

      const newDateA = moment(arrives).format('LLL');
      const newDateD = moment(departs).format('LLL');

      const length = arrives.diff(departs, 'hours')

      if (error) {
        return <div > Error: {
          error.message
        } < /div>;
      } else if (!isLoaded) {
        return <div > Loading... < /div>;
      } else {
        return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div className='flightWrapper'>
        {items.flights.map(item => (
          <FlightCard from={item.departs.airport} flight={item} to={item.arrives.airport} airline={item.airline} clickProp={this.handleShow} key={item.number}/>

        ))}
        </div>
              <Modal
             show={this.state.show}
             onHide={this.handleClose}
             >
               <Modal.Header closeButton>
                 <h1>{this.state.flight.airline}</h1>
               </Modal.Header>
               <Modal.Body>
               <Row>
                 <Col>
                  <h1>{flightPicked.departs.airport}</h1>
                </Col>
                <Col>
                  <h1>{flightPicked.arrives.airport}</h1>
                </Col>
              </Row>
               <Row>
                 <Col>
                   <h3>Departure Time</h3>
                   <p>{newDateD}</p>
                 </Col>
                 <Col>
                   <h3>Arrival Time</h3>
                   <p>{newDateA}</p>
                 </Col>
                </Row>
               <p><span className="bold"> Flight length:</span> {length} hours</p>
               <p className='cost'>Total:<span className='cost'>{flightPicked.cost}</span></p>
               <Form onSubmit={e => this.handleSubmit(e)}
                 noValidate
                 validated={validated}
                >
                  <Row>
                   <Col>
                     <Form.Control required placeholder="First name" name="firstname" onChange={this.handleInputChange}  />
                   </Col>
                   <Col>
                     <Form.Control required placeholder="Last name" name="lastname"onChange={this.handleInputChange}  />

                   </Col>
                 </Row>
                <Col>
                  <Row>
                    <Form.Control required as="select" name='bags' onChange={this.handleInputChange} className='dropBar' >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </Form.Control>
                  </Row>
                </Col>
                <Button variant="primary" size='lg' type="submit" block>
                  Submit
                </Button>
              </Form>
               </Modal.Body>
               <Alert dismissible variant="danger" show={this.state.errors}>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>{this.state.errorMessage}</p>
              </Alert>

             </Modal>
      </div>
    );
    }
  }
}


export default App;
