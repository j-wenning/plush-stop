import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className="navbar navbar-dark bg-dark mb-4">
        <a href="#" className="navbar-brand col">
          <h2 className="col">
            <i className="fas fa-dollar-sign" /> Wicked Sales
          </h2>
        </a>
        <div className="col">
          <h2 className="col navbar-text text-right">
            {this.props.cartItemCount} items
            <i className="fas fa-shopping-cart"/>
          </h2>
        </div>
      </div>
    );
  }
}
