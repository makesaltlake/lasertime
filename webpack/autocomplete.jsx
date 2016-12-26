import React from 'react';
import onClickOutside from 'react-onclickoutside';

const TAB = 9;

export let Autocomplete = onClickOutside(React.createClass({
  getInitialState() {
    return {
      value: '',
      focused: false,
      itemChosen: false
    }
  },

  render() {
    let containerClass = this.props.containerClass || '';
    let inputClass = this.props.inputClass || '';
    let dropdownClass = this.props.dropdownClass || '';

    containerClass += ' dropdown autocomplete-container';
    inputClass += ' form-control';
    dropdownClass += ' dropdown-menu autocomplete-dropdown';

    let displayedItems = [];

    if (this.state.focused && this.getValue().length > 0 && !this.state.itemChosen) {
      displayedItems = this.findMatches(this.getValue(), this.props.items);
    }

    if (displayedItems.length > 0) {
      containerClass += ' open';
    }

    return <div className={containerClass}>
      <input
        className={inputClass}
        value={this.getValue()}
        onChange={this.onValueChanged}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
        {...this.props.inputProps}
      />
      <ul className={dropdownClass} style={{width: '100%', fontSize: '16px', padding: '10px 0'}}>
        {
          displayedItems.map(item => {
            return <li key={item}>
              <a href="#" onClick={this.itemChosen.bind(this, item)}>{item}</a>
            </li>
          })
        }
      </ul>
    </div>
  },

  onValueChanged(event) {
    this.setValue(event.target.value);
    this.setState({itemChosen: false});
  },

  onFocus(event) {
    this.setState({focused: true});
  },

  onKeyDown(event) {
    if (event.keyCode == TAB) {
      this.setState({focused: false});
    }
  },

  setValue(value) {
    if (this.props.onValueChanged) {
      this.props.onValueChanged(value);
    } else {
      this.setState({value});
    }
  },

  getValue() {
    return this.props.value || this.state.value;
  },

  findMatches(value, items) {
    let matches = [];
    value = value.toLowerCase();

    items.forEach(item => {
      // TODO: Make this smarter, maybe match if all words in value are present in the item
      if (item.toLowerCase().indexOf(value) != -1) {
        matches.push(item);
      }
    });

    return matches;
  },

  itemChosen(item, event) {
    event.preventDefault();
    this.setValue(item);
    this.setState({itemChosen: true});
  },

  handleClickOutside() {
    this.setState({focused: false});
  }
}));