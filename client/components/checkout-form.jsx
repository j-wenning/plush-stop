import React from 'react';

export default class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      creditCard: null,
      streetAddress: null,
      city: null,
      state: '--',
      zip: null,
      nameBlur: false,
      creditCardBlur: false,
      streetAddressBlur: false,
      cityBlur: false,
      stateBlur: false,
      zipBlur: false
    };
    this.stateCodeList = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
  }

  onValChange(e, prop) {
    const ct = e.currentTarget;
    if (ct.value.trim() === '') ct.value = '';
    else if (!this.state[prop] || ct.value.length > this.state[prop].length) {
      switch (prop) {
        case 'name':
          ct.value = ct.value.replace(/(\s\s)+/g, ' ').replace(/(\d|\B\W\W)+/g, '').substr(0, 64);
          break;
        case 'creditCard':
          ct.value = ct.value.replace(/\D/g, '').replace(/\d{4}/g, sub => sub + ' ').substr(0, 19);
          break;
        case 'streetAddress':
          ct.value = ct.value.replace(/(\s\s)+/g, ' ').replace(/(\B\W)+/g, '').substr(0, 42);
          break;
        case 'city':
          ct.value = ct.value.replace(/(\s\s)+/g, ' ').replace(/(\d|\B\W\W)+/g, '').substr(0, 50);
          break;
        case 'state':
          break;
        case 'zip':
          ct.value = ct.value.replace(/\D/g, '').replace(/\d{9}/g, sub => sub.substr(0, 5) + '-' + sub.substr(5, 9)).substr(0, 10);
          break;
        default:
          console.error('invalid prop "', prop, '"');
          break;
      }
    }
    this.setState({ [prop]: ct.value.trim() || ct.value });
  }

  onBlur(prop) {
    this.setState({ [prop + 'Blur']: true });
  }

  validate(prop) {
    if (prop !== 'all' && this.state[prop] === null) return null;
    switch (prop) {
      case 'name':
        return this.state.name.length > 4
          ? null : 'Name must be over 4 characters long.';
      case 'creditCard':
        return this.state.creditCard.length === 19
          ? null : 'Card Number must be 16 digits long.';
      case 'streetAddress':
        return this.state.streetAddress.length > 5
          ? null : 'Address must be over 5 characters long.';
      case 'city':
        return this.state.city.length > 3
          ? null : 'City must be over 3 characters long.';
      case 'state':
        return this.state.state !== '--'
          ? null : 'Please select a state';
      case 'zip':
        return this.state.zip.length === 5 || this.state.zip.length === 10
          ? null : 'Zip must be 5 or 9 digits long.';
      case 'all':
        return !!(
          this.state.name &&
          this.state.name.length > 4 &&
          this.state.creditCard &&
          this.state.creditCard.length === 19 &&
          this.state.streetAddress &&
          this.state.streetAddress.length > 5 &&
          this.state.city &&
          this.state.city.length > 3 &&
          this.state.state &&
          this.state.state !== '--' &&
          this.state.zip &&
          (this.state.zip.length === 5 || this.state.zip.length === 10)
        );
      default:
        console.error('invalid prop "', prop, '"');
        break;
    }
  }

  placeOrder(e, order) {
    e.preventDefault();
    if (this.props.cart.length > 0) {
      this.props.placeOrder(order);
    } else alert('Your cart is empty!');
  }

  render() {
    const total = this.props.cart.reduce((a, b) => a + b.price * b.quantity, 0);
    const formVals = {
      name: this.state.name,
      creditCard: this.state.creditCard,
      shippingAddress: `${this.state.streetAddress}\n${this.state.city}, ${this.state.state} ${this.state.zip}`
    };
    const enabled = this.validate('all');
    return (
      <div className="container">
        <h1 className="mb-3">My Cart</h1>
        <h3 className="text-secondary mb-5">Order Total: ${(total / 100).toFixed(2)}</h3>
        <form onSubmit={e => this.placeOrder(e, formVals)}>
          <h3 className="form-text text-danger">Please do not supply any real information on this form.</h3>
          <div className="row">
            <div className="form-group col-12 col-md-6">
              <label htmlFor="name">Name</label>
              <input
                onChange={e => this.onValChange(e, 'name')}
                onBlur={e => this.onBlur('name')}
                className="form-control"
                type="text"
                name="name"
                id="name"
                required/>
              {
                this.state.nameBlur &&
                <small className="form-text text-danger">{this.validate('name')}</small>
              }
            </div>
            <div className="form-group col-12 col-md-6">
              <label htmlFor="creditCard">Credit Card</label>
              <input
                onChange={e => this.onValChange(e, 'creditCard')}
                onBlur={e => this.onBlur('creditCard')}
                className="form-control"
                type="text"
                name="creditCard"
                id="creditCard"
                required/>
              {
                this.state.creditCardBlur &&
                <small className="form-text text-danger">{this.validate('creditCard')}</small>
              }
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              onChange={e => this.onValChange(e, 'streetAddress')}
              onBlur={e => this.onBlur('streetAddress')}
              className="form-control"
              name="streetAddress"
              id="streetAddress"
              required/>
            {
              this.state.streetAddressBlur &&
              <small className="form-text text-danger">{this.validate('streetAddress')}</small>
            }
          </div>
          <div className="row">
            <div className="form-group col-5">
              <label htmlFor="city">City</label>
              <input
                onChange={e => this.onValChange(e, 'city')}
                onBlur={e => this.onBlur('city')}
                className="form-control"
                name="city"
                id="city"
                required/>
              {
                this.state.cityBlur &&
                <small className="form-text text-danger">{this.validate('city')}</small>
              }
            </div>
            <div className="form-group col-3">
              <label htmlFor="state">State</label>
              <select
                onChange={e => this.onValChange(e, 'state')}
                onBlur={e => this.onBlur('state')}
                className="form-control"
                name="state"
                id="state"
                required
                defaultValue={this.state.state}>
                <option value={'--'} disabled>--</option>
                {
                  this.stateCodeList.map((state, i) =>
                    <option key={i} value={state}>{state}</option>)
                }
              </select>
              {
                this.state.stateBlur &&
                <small className="form-text text-danger">{this.validate('state')}</small>
              }
            </div>
            <div className="form-group col-4">
              <label htmlFor="zip">Zip</label>
              <input
                onChange={e => this.onValChange(e, 'zip')}
                onBlur={e => this.onBlur('zip')}
                className="form-control"
                name="zip"
                id="zip"
                required/>
              {
                this.state.zipBlur &&
                <small className="form-text text-danger">{this.validate('zip')}</small>
              }
            </div>
          </div>
          <div className="row">
            <div className="col">
              <a onClick={this.props.viewCatalog} className="text-secondary">{'< Continue Shopping'}</a>
            </div>
            <div className="col text-right">
              <button className="btn btn-primary" type="submit" disabled={!enabled}>Place Order</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
