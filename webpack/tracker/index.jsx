
import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import axios from 'axios';
import {observable, computed, reaction} from 'mobx';
import {observer} from 'mobx-react';
import moment from 'moment';
import {Autocomplete} from '../autocomplete.jsx';

function formatDuration(originalSeconds) {
  let hours = Math.floor(originalSeconds / 3600);
  let minutes = Math.floor((originalSeconds % 3600) / 60);
  let seconds = originalSeconds % 60;

  let parts = []
  if (hours > 0) {
    parts.push(hours + 'h');
  }
  if (minutes > 0) {
    parts.push(minutes + 'm');
  }
  if (seconds > 0 || originalSeconds == 0) {
    parts.push(seconds + 's');
  }

  return parts.join(' ');
}


class ResourceStore {
  @observable data = null;
  @observable error = null;
  @observable errored = false;
  @observable loading = false;
  reloadAgain = false;
  request = null;

  constructor(url, params = {}) {
    this.url = url;
    this.params = params;
    this.reload();
  }

  reload() {
    if (this.request != null) {
      // request already in flight, schedule another one to kick off when this one finishes
      this.reloadAgain = true;
    } else {
      // no current request, kick one off
      axios.get(this.url, {
        params: this.params
      }).then((response) => {
        this.request = null;
        this.data = response.data;
        this.error = null;
        this.errored = false;

        if (this.reloadAgain) {
          this.reloadAgain = false;
          this.reload();
        }
      }).catch((error) => {
        this.request = null;
        this.error = error;
        this.errored = true;

        if (this.reloadAgain) {
          this.reloadAgain = false;
          this.reload();
        }
      })
    }
  }
}


class TrackerStore {
  @observable selectedMachineId = null;

  constructor() {
    this.machinesStore = new ResourceStore('/api/machines');
    this.eventsStore = new ResourceStore('/api/events');
    this.peopleStore = new ResourceStore('/api/people');

    reaction(() => {
      return this.machinesStore.data
    }, (machines) => {
      if (machines != null && this.selectedMachineId == null) {
        this.selectedMachineId = machines[0].id;
      }
    }, true);
  }

  @computed get machines() {
    return this.machinesStore.data || [];
  }

  @computed get events() {
    return this.eventsStore.data || [];
  }

  @computed get people() {
    return this.peopleStore.data || [];
  }

  @computed get personNames() {
    return this.people.map(person => {
      return person.name;
    });
  }

  @computed get color() {
    let color = null;

    (this.machinesStore.data || []).forEach((machine) => {
      if (machine.id == this.selectedMachineId) {
        color = machine.color;
      }
    });

    return color;
  }
}


var Tracker = observer(React.createClass({
  getInitialState() {
    return {
      name: '',
      minutes: '',
      seconds: '',
      mode: 'vector',
      submitting: false
    };
  },

  render() {
    return <div>
      <div className="top-bar" style={{backgroundColor: this.props.store.color}}>
        <div className="top-bar-machine-chooser">
          <div className="form-inline">
            <select className="form-control input-lg" value={this.state.selectedMachineId} onChange={this.machineChanged}>
              {
                this.props.store.machines.map(function(machine) {
                  return <option key={machine.id} value={machine.id}>{machine.name}</option>
                })
              }
            </select>
          </div>
        </div>
        <div className="top-bar-title">Laser time</div>
        <div className="form-inline entry-form">
          <Autocomplete
            value={this.state.name}
            onValueChanged={this.nameChanged}
            inputClass="input-lg"
            items={this.props.store.personNames}
            inputProps={{size: '50', placeholder: 'Name'}}
          />
          <input size="2" placeholder="MM" className="form-control input-lg minutes" value={this.state.minutes} onChange={this.minutesChanged}/>
          <div className="separator">:</div>
          <input size="2" placeholder="SS" className="form-control input-lg seconds" value={this.state.seconds} onChange={this.secondsChanged}/>
          <select className="form-control input-lg" value={this.state.mode} onChange={this.modeChanged}>
            <option value="vector">Vector</option>
            <option value="raster">Raster</option>
          </select>
          <button type="submit" className="btn btn-success btn-lg" disabled={this.state.submitting} onClick={this.submit}>Enter</button>
        </div>
      </div>
      <div className="data-div">
        <table style={{'margin': '0 auto'}}>
          <tbody>
            {
              this.props.store.events.map(function(event) {
                return <tr key={event.id} className="data-row">
                  <td className="name-col">
                    {event.person_name}
                  </td>
                  <td className="duration-col">
                    {formatDuration(event.seconds)}
                  </td>
                  <td className="type-col">
                    {event.mode == 'vector' ? 'Vector' : 'Raster'}
                  </td>
                  <td className="date-col">
                    {moment(event.created_at).format('M/D/YYYY')}
                  </td>
                  <td className="time-col">
                    {moment(event.created_at).format('h:mma')}
                  </td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>
    </div>;
  },

  machineChanged(event) {
    this.store.selectedMachineId = event.target.value;
    this.setState({machine: event.target.value})
  },

  nameChanged(value) {
    this.setState({name: value});
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

  submit(event) {
    axios.post('/api/events', {
      authenticity_token: AUTHENTICITY_TOKEN,
      machine_id: this.props.store.selectedMachineId,
      name: this.state.name,
      seconds: (parseInt(this.state.minutes) * 60) + parseInt(this.state.seconds),
      mode: this.state.mode
    }).then((response) => {
      this.props.store.eventsStore.reload();
      this.setState({
        submitting: false,
        name: '',
        minutes: '',
        seconds: '',
        mode: 'vector'
      });
    }).catch((error) => {
      this.setState({
        submitting: false
      });
    });

    this.setState({submitting: true});
  }
}));


export default function() {
  let store = new TrackerStore();
  ReactDOM.render(<Tracker store={store}/>, document.getElementById('tracker'));
}
