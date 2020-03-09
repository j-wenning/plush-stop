import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar navbar-dark bg-dark mb-4">
        <a href="#" className="navbar-brand">
          <i className="fas fa-dollar-sign" /> Wicked Sales
        </a>
      </div>
    );
  }
}
