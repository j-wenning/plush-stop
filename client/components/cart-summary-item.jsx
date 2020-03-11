import React from 'react';

export default class CartSummaryItem extends React.Component {
  render() {
    return (
      <div className="card cart-summary-item">
        <div className="row">
          <div className="col-4 d-flex align-items-center">
            <div className="row">
              <img src={this.props.item.image} className="col-12" alt=""/>
            </div>
          </div>
          <div className="col-7 d-flex flex-wrap align-items-center">
            <div className="row">
              <h2 className="col-12">{this.props.item.name}</h2>
              <h3 className="col-12 text-secondary">{'$' + (this.props.item.price / 100).toFixed(2)}</h3>
              <p className="col-12">{this.props.item.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
