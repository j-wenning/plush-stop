import React from 'react';
import ConfirmationModal from './confirmation-modal';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: '',
      product: null,
      added: false
    };
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

  addProduct(id) {
    this.props.addToCart(id);
    this.setState({ added: true });
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
        {
          this.state.added && <ConfirmationModal
            primaryText={'This item has been added to your cart.'}
            primaryAction={{
              action: this.props.viewCart,
              text: 'view cart'
            }}
            secondaryAction={{
              action: this.props.viewCatalog,
              text: 'back to shopping'
            }}
            close={() => this.setState({ added: false })} />
        }
        <div className="card p-4">
          <div className="row">
            <div className="col mb-3">
              <a onClick={this.props.viewCatalog} className="text-secondary">{'< Back to Catalog'}</a>
            </div>
          </div>
          <div className="row">
            <img src={this.state.product.image} className="img-fluid col-md-5" alt=""/>
            <div className="col-md-7 pl-md-5">
              <h2>{this.state.product.name}</h2>
              <h3 className="text-secondary">${(this.state.product.price / 100).toFixed(2)}</h3>
              <button
                type="button"
                onClick={() => this.addProduct(this.props.productId)}
                className="btn btn-primary mt-4">Add to Cart</button>
              <h4 className="mt-4">Product Details</h4>
              <ul>
                <li>{`${this.state.product.height}" x ${this.state.product.width}"`}</li>
                {details}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
