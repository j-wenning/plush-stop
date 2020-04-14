import React from 'react';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, message: '', product: null };
  }

  getProduct(id) {
    fetch('api/products/' + id)
      .then(req => req.json())
      .then(data => this.setState({ product: data }))
      .catch(err => this.setState({
        error: true,
        message: err
      }));
  }

  componentDidMount() {
    this.getProduct(this.props.productId);
  }

  render() {
    if (!this.state.product) return '';
    return (
      <div className="container product-details">
        <div className="card p-4">
          <div className="row">
            <div className="col mb-3">
              <a onClick={this.props.setView} className="text-secondary">{'< Back to Catalog'}</a>
            </div>
          </div>
          <div className="row">
            <img src={this.state.product.image} className="img-fluid col-5" alt=""/>
            <div className="col-7">
              <h2>{this.state.product.name}</h2>
              <h3 className="text-secondary">${(this.state.product.price / 100).toFixed(2)}</h3>
              <p>{this.state.product.shortDescription}</p>
              <button
                type="button"
                onClick={() => this.props.addToCart(this.props.productId)}
                className="btn btn-primary">Add to Cart</button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p>{this.state.product.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
