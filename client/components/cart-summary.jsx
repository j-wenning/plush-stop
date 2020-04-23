import React from 'react';
import CartSummaryItem from './cart-summary-item';
import ConfirmationModal from './confirmation-modal';

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
          this.state.removing && <ConfirmationModal
            primaryText={'Are you sure you want to remove this item?'}
            primaryAction={{
              action: () => {
                this.setState({ removing: null });
                this.props.removeFromCart(this.state.removing);
              },
              text: 'remove',
              color: 'btn-danger'
            }}
            secondaryAction={{
              action: () => this.setState({ removing: null }),
              text: 'cancel'
            }}
            close={() => this.setState({ removing: null })}/>
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
