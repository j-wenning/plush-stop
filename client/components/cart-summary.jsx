import React from 'react';
import CartSummaryItem from './cart-summary-item';

export default class CartSummary extends React.Component {
  condenseProducts() {
    const result = [];
    const cart = this.props.cart;
    let index;
    for (let i = 0; i < cart.length; ++i) {
      index = result.findIndex(a => a.productId === cart[i].productId);
      if (index === -1) {
        result.push({ ...cart[i] });
        result[result.length - 1].quantity = 1;
      } else ++result[index].quantity;
    }
    return result;
  }

  render() {
    const items = this.condenseProducts().map(item =>
      <CartSummaryItem
        key={item.cartItemId}
        item={item}
        setView={() => this.props.viewDetails({ productId: item.productId })}
        addToCart={(productId, quantity) => this.props.addToCart(productId, quantity)}
        removeFromCart={(productId, quantity) => this.props.removeFromCart(productId, quantity)}/>
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
