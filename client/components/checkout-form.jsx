import React from 'react';

export default class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', creditCard: '', shippingAddress: '' };
  }

  onValChange(e, val) {
    this.setState({ [val]: e.currentTarget.value });
  }

  placeOrder(e, order) {
    e.preventDefault();
    if (this.props.cart.length > 0) {
      this.props.placeOrder(order);
      this.props.setView();
    } else alert('Your cart is empty!');
  }

  render() {
    const total = this.props.cart.reduce((a, b) => a + b.price * b.quantity, 0);
    const { ...formVals } = this.state;
    return (
      <div className="container-fluid">
        <h1 className="mb-3">My Cart</h1>
        <h3 className="text-secondary mb-5">Order Total: ${(total / 100).toFixed(2)}</h3>
        <form onSubmit={e => this.placeOrder(e, formVals)}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              onChange={e => this.onValChange(e, 'name')}
              className="form-control"
              type="text"
              name="name"
              id="name"
              required/>
          </div>
          <div className="form-group">
            <label htmlFor="credit">Credit Card</label>
            <input
              onChange={e => this.onValChange(e, 'creditCard')}
              className="form-control"
              type="text"
              name="credit"
              id="credit"
              required/>
          </div>
          <div className="form-group">
            <label htmlFor="shipping">Shipping Address</label>
            <textarea
              onChange={e => this.onValChange(e, 'shippingAddress')}
              className="form-control"
              name="shipping"
              id="shipping"
              cols="30"
              rows="10"
              required/>
          </div>
          <div className="row">
            <div className="col">
              <a onClick={this.props.setView} className="text-secondary">{'< Continue Shopping'}</a>
            </div>
            <div className="col text-right">
              <button className="btn btn-primary" type="submit">Place Order</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
