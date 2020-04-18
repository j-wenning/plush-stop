import React from 'react';

export default class ProductListItem extends React.Component {
  render() {
    return (
      <div className="col mb-4 product-list-item">
        <div onClick={this.props.setView} className="card">
          <img src={this.props.product.image} className="mt-1 card-img-top img-fluid" alt="" />
          <div className="card-body">
            <h5 className="card-title">
              {this.props.product.name}
            </h5>
            <h6 className="card-subtitle text-secondary">
              ${(this.props.product.price / 100).toFixed(2)}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}
