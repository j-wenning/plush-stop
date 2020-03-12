import React from 'react';
import CartSummaryItem from './cart-summary-item';

export default class CartSummary extends React.Component {
  render() {
    const items = this.props.cart.map(item =>
      <CartSummaryItem
        key={item.cartItemId}
        item={item}
        setView={() => this.props.viewDetails({ productId: item.productId })}/>
    );
    const total = this.props.cart.reduce((a, b) => a + b.price, 0);
    return (
      <div className="container cart-summary">
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
        <div className="row">
          <div className="col card-columns">
            {
              items.length
                ? items : <p>Your cart is empty.</p>
            }
          </div>
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
