import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className="navbar navbar-dark bg-dark mb-4">
        <a href="" className="navbar-brand col">
          <h2 className="col-12 col-sm">
            <i className="fas fa-dollar-sign" /> Wicked Sales
          </h2>
        </a>
        <a onClick={this.props.setView} className="col-12 col-sm">
          <h2 className="col navbar-text text-sm-right">
            {this.props.cartItemCount} items
            <i className="fas fa-shopping-cart" />
          </h2>
        </a>
      </div>
    );
  }
}
