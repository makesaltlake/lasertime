
import React from 'react';
import {Button} from 'react-bootstrap';

export default React.createClass({
  getMachines() {
    return [
      {
        id: '1',
        name: 'FSL',
        color: '#09e'
      },
      {
        id: '2',
        name: 'K40',
        color: '#e34'
      }
    ];
  },

  getInitialState() {
    return {
      name: '',
      minutes: '',
      seconds: '',
      mode: 'vector',
      machine: '1'
    };
  },

  getColor() {
    let color = null;
    this.getMachines().forEach((machine) => {
      if (machine.id == this.state.machine) {
        color = machine.color;
      }
    });
    return color;
  },

  render() {
    return <div className="top-bar" style={{backgroundColor: this.getColor()}}>
      <div className="top-bar-machine-chooser">
        <div className="form-inline">
          <select className="form-control input-lg" value={this.state.machine} onChange={this.machineChanged}>
            {
              this.getMachines().map(function(machine) {
                return <option value={machine.id}>{machine.name}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="top-bar-title">Laser time</div>
      <div className="form-inline entry-form">
        <input size="50" placeholder="Name" className="form-control input-lg" value={this.state.name} onChange={this.nameChanged}/>
        <input size="2" placeholder="MM" className="form-control input-lg minutes" value={this.state.minutes} onChange={this.minutesChanged}/>
        <div className="separator">:</div>
        <input size="2" placeholder="SS" className="form-control input-lg seconds" value={this.state.seconds} onChange={this.secondsChanged}/>
        <select className="form-control input-lg" value={this.state.mode} onChange={this.modeChanged}>
          <option value="vector">Vector</option>
          <option value="raster">Raster</option>
        </select>
        <button type="submit" className="btn btn-success btn-lg">Enter</button>
      </div>
    </div>;
  },

  machineChanged(event) {
    this.setState({machine: event.target.value})
  },

  nameChanged(event) {
    this.setState({name: event.target.value});
  },

  minutesChanged(event) {
    this.setState({minutes: event.target.value.replace(/[^0-9]/g, '')});
  },

  secondsChanged(event) {
    this.setState({seconds: event.target.value.replace(/[^0-9]/g, '')});
  },

  modeChanged(event) {
    this.setState({mode: event.target.value});
  },

  onClick() {
    this.setState({hits: this.state.hits + 1});
  }
});
