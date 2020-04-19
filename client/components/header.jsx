import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className="navbar navbar-light bg-warning mb-4">
        <div className="col">
          <a onClick={this.props.viewCatalog} className="navbar-brand">
            <img
              src="./images/favicon.png"
              width="50"
              height="50"
              style={{ filter: 'invert(100%)' }}
              alt=""
              className="d-none d-sm-inline-block align-text-bottom" />
            <h2 className="col-11 d-inline-block align-text-bottom">Plush Stop</h2>
          </a>
        </div>
        <div className="col-12 col-sm text-sm-right">
          <a onClick={this.props.viewCart} className="navbar-text">
            <h2>
              {this.props.cartItemCount} items
              <i className="fas fa-shopping-cart" />
            </h2>
          </a>
        </div>
      </div>
    );
  }
}
