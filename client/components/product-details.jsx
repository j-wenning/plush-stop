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
    const details = this.state.product.details.split('\\n').map((item, index) => (
      <li key={index}>{item}</li>
    ));
    return (
      <div className="container product-details">
        <div className="card p-4">
          <div className="row">
            <div className="col mb-3">
              <a onClick={this.props.setView} className="text-secondary">{'< Back to Catalog'}</a>
            </div>
          </div>
          <div className="row">
            <img src={this.state.product.image} className="img-fluid col-md-5" alt=""/>
            <div className="col-md-7 pl-md-5">
              <h2>{this.state.product.name}</h2>
              <h3 className="text-secondary">${(this.state.product.price / 100).toFixed(2)}</h3>
              <button
                type="button"
                onClick={() => this.props.addToCart(this.props.productId)}
                className="btn btn-primary mt-4">Add to Cart</button>
              <h4 className="mt-4">Product Details</h4>
              <ul>
                <li>{`${this.state.product.height}" x ${this.state.product.width}"`}</li>
                {details}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col">

            </div>
          </div>
        </div>
      </div>

    );
  }
}
