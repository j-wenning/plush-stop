import React from 'react';

export default class CartSummaryItem extends React.Component {
  render() {
    return (
      <div className="card cart-summary-item">
        <div className="row">
          <div className="col-4 d-flex align-items-center">
            <div className="row">
              <a onClick={this.props.setView}>
                <img src={this.props.item.image} className="col-12" alt="" />
              </a>
            </div>
          </div>
          <div className="col-7 d-flex flex-wrap align-items-center">
            <div className="row">
              <a onClick={this.props.setView}>
                <h2 className="col-12">{this.props.item.name}</h2>
              </a>
              <h3 className="col-12 text-secondary">{'$' + (this.props.item.price / 100).toFixed(2)}</h3>
              <p className="col-12">{this.props.item.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
