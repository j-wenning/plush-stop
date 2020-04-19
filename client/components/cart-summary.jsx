import React from 'react';
import CartSummaryItem from './cart-summary-item';

export default class CartSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      removing: null
    };
  }

  setRemoving(productId) {
    this.setState({ removing: productId });
  }

  render() {
    const items = this.props.cart.map(item =>
      <CartSummaryItem
        key={item.cartItemId}
        item={item}
        setView={() => this.props.viewDetails({ productId: item.productId })}
        modifyInCart={(cartItemId, quantity) => this.props.modifyInCart(cartItemId, quantity)}
        removeFromCart={productId => this.setRemoving(productId)}/>
    );
    const total = this.props.cart.reduce((a, b) => a + b.price * b.quantity, 0);
    return (
      <div className="container cart-summary">
        {
          <div
            className="modal"
            style={{ display: this.state.removing ? 'block' : 'none' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Are you sure you want to remove this item?</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => this.setState({ removing: null })}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => this.setState({ removing: null })}>
                      Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      this.setState({ removing: null });
                      this.props.removeFromCart(this.state.removing);
                    }}>
                      Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        <div className="row">
          <div className="col mb-3">
            <a onClick={this.props.viewCatalog} className="text-secondary">{'< Back to catalog'}</a>
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <h2>My Cart</h2>
          </div>
        </div>
        <div className="row row-cols-1">
          {
            items.length
              ? items : <p className="col">Your cart is empty.</p>
          }
        </div>
        {
          this.props.cart.length > 0 &&
          <div className="row">
            <div className="col">
              <h2>Item total: ${(total / 100).toFixed(2)}</h2>
            </div>
            <div className="col text-right">
              <button onClick={this.props.viewCheckout} className="btn btn-primary">Checkout</button>
            </div>
          </div>
        }
      </div>
    );
  }
}
