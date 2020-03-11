import React from 'react';

export default class CheckoutForm extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <h1>My Cart</h1>
        <h3>Order Total: {}</h3>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              id="name"/>
          </div>
          <div className="form-group">
            <label htmlFor="credit">Credit Card</label>
            <input
              className="form-control"
              type="text"
              name="credit"
              id="credit"/>
          </div>
          <div className="form-group">
            <label htmlFor="shipping">Shipping Address</label>
            <textarea
              className="form-control"
              name="shipping"
              id="shipping"
              cols="30"
              rows="10"/>
          </div>
        </form>
        <div className="row">
          <div className="col">
            <a onClick={''}>Continue Shopping</a>
          </div>
          <div className="col text-right">
            <button onClick={''} type="button">Place Order</button>
          </div>
        </div>
      </div>
    );
  }
}
