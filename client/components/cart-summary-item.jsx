import React from 'react';

export default class CartSummaryItem extends React.Component {
  modifyItem(e) {
    e.target.value = Math.min(Math.max(Number(e.target.value), 1), 99);
    this.props.modifyInCart(this.props.item.cartItemId, e.target.value);
  }

  removeItem() {
    this.props.removeFromCart(this.props.item.cartItemId);
  }

  render() {
    return (
      <div className="my-2 card cart-summary-item">
        {
          <div className="my-2 row no-gutters">
            <div className="col-md-4">
              <a onClick={this.props.setView}>
                <img src={this.props.item.image} className="col-12" alt="" />
              </a>
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <a onClick={this.props.setView}>
                  <h2 className="col-12">{this.props.item.name}</h2>
                </a>
                <h3 className="col-12 text-secondary">${(this.props.item.price / 100).toFixed(2)}</h3>
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <button onClick={() => this.removeItem()} className="btn btn-danger">Remove item</button>
                    </div>
                    <div className="col-6">
                      <div className="from-group row">
                        <label className="col-form-label col-8 text-right" htmlFor="">Qty</label>
                        <input
                          onChange={e => this.modifyItem(e)}
                          className="form-control col-4"
                          type="number"
                          name=""
                          id=""
                          defaultValue={this.props.item.quantity} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
