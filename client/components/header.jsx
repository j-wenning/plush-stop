import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className="navbar navbar-light bg-warning mb-4">
        <a onClick={this.props.viewCatalog} className="navbar-brand col">
          <img
            src="./images/favicon.png"
            width="50"
            height="50"
            style={{ filter: 'invert(100%)' }}
            alt=""
            className="d-none d-sm-inline-block align-text-bottom" />
          <h2 className="col-11 d-inline-block align-text-bottom">Plush Stop</h2>
        </a>
        <a onClick={this.props.viewCart} className="col-12 col-sm">
          <h2 className="col navbar-text text-sm-right">
            {this.props.cartItemCount} items
            <i className="fas fa-shopping-cart" />
          </h2>
        </a>
      </div>
    );
  }
}
