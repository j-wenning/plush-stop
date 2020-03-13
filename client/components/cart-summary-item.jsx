import React from 'react';

export default class CartSummaryItem extends React.Component {
  setQuantity(e) {
    const qty = this.props.item.quantity;
    if (e) {
      const val = Number(e.target.value);
      if (qty > val) this.props.removeFromCart(this.props.item.productId, qty - val);
      else this.props.addToCart(this.props.item.productId, val - qty);
    } else this.props.removeFromCart(this.props.item.productId, qty);
  }

  removeAll() {
    this.props.removeFromCart(this.props.item.quantity);
  }

  render() {
    return (
      <div className="card cart-summary-item">
        <div className="row">
          <div className="col-4 d-flex align-items-center">
            <div className="row">
              <a onClick={this.props.setView}>
                <img src={this.props.item.image} className="col-12" alt="" />
              </a>
            </div>
          </div>
          <div className="col-7 d-flex flex-wrap align-items-center">
            <div className="row">
              <a onClick={this.props.setView}>
                <h2 className="col-12">{this.props.item.name}</h2>
              </a>
              <h3 className="col-12 text-secondary">${(this.props.item.price / 100).toFixed(2)}</h3>
              <p className="col-12">{this.props.item.shortDescription}</p>
              <div className="col-6">
                <button onClick={() => this.setQuantity()} className="btn btn-danger">Remove item</button>
              </div>
              <div className="col-6">
                <div className="from-group row">
                  <label className="col-form-label col-9 text-right" htmlFor="">Qty</label>
                  <input
                    onChange={e => this.setQuantity(e)}
                    className="form-control col-3"
                    type="number"
                    name=""
                    id=""
                    defaultValue={this.props.item.quantity}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
