import React from 'react';

export default class ProductListItem extends React.Component {
  render() {
    return (
      <div className="card product-list-item">
        <div className="card-body">
          <img src={this.props.product.image} className="card-img-top img-fluid" alt=""/>
          <h5 className="card-title">
            {this.props.product.name}
          </h5>
          <h6 className="card-subtitle text-secondary">
            {'$' + (this.props.product.price / 100).toFixed(2)}
          </h6>
          <p className="card-text">
            {this.props.product.shortDescription}
          </p>
        </div>
      </div>
    );
  }
}
