import React from 'react';

export default class ProductListItem extends React.Component {
  addToCart(e) {
    e.stopPropagation();
    this.props.addToCart();
  }

  render() {
    return (
      <div className="col mb-4 product-list-item">
        <div onClick={this.props.setView} className="card">
          <img src={this.props.product.image} className="mt-1 card-img-top img-fluid" alt="" />
          <div className="card-body">
            <div className="row no-gutters">
              <div className="col-8 no-gutters">
                <h5 className="card-title">
                  {this.props.product.name}
                </h5>
                <h6 className="card-subtitle text-secondary">
                  ${(this.props.product.price / 100).toFixed(2)}
                </h6>
              </div>
              <div className="d-flex col-4 no-gutters justify-content-end">
                <button onClick={e => this.addToCart(e)} className="btn btn-success">
                  <i className="fas fa-plus"/>
                  <i className="fas fa-shopping-cart" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
