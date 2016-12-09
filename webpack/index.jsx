
import React from 'react';
import ReactDOM from 'react-dom';

import Tracker from './tracker/index.jsx';

module.exports = {
  startTracker: function() {
    ReactDOM.render(<Tracker/>, document.getElementById('tracker'));
  },

  startReporter: function() {
    console.log('TBD');
  }
}
