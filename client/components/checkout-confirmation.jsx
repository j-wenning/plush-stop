import React from 'react';

export default class CheckoutConfirmation extends React.Component {
  render() {
    let total = 0;
    const rows = this.props.cart.map(item => {
      total += item.total;
      return (<tr key={item.productId}>
        <td>{item.name}</td>
        <td>{item.quantity}</td>
        <td>{'$' + (item.total / 100).toFixed(2)}</td>
      </tr>);
    });
    return (
      <div className="container checkout-confirmation">
        <div className="card p-4">
          <h5 className="card-title">Checkout Summary</h5>
          <table className="table table-striped thead-dark">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows}
              <tr className="table-info">
                <th>Grand Total</th>
                <td></td>
                <th>{'$' + (total / 100).toFixed(2)}</th>
              </tr>
            </tbody>
          </table>
          <h6 className="card-text">Your order has been recieved.  Thank you for &lsquo;shopping&rsquo; with us.</h6>
          <a onClick={this.props.viewCatalog} className="text-secondary mt-5">{'< Back to Catalog'}</a>
        </div>
      </div>
    );
  }
}
