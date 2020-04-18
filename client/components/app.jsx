import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';
import CheckoutConfirmation from './checkout-confirmation';
import Notice from './notice';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      },
      cart: [],
      visitCount: null
    };
  }

  setView(name, params) {
    this.setState({ view: { name, params } });
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => this.setState({
        cart: data
      }))
      .catch(err => console.error(err));
  }

  addToCart(productId) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })
      .then(res => res.json())
      .then(data => {
        const [...cart] = this.state.cart;
        const index = cart.findIndex(a => a.cartItemId === data.cartItemId);
        if (index !== -1) cart.splice(index, 1, data);
        else cart.push(data);
        this.setState({ cart });
      })
      .catch(err => console.error(err));
  }

  modifyInCart(cartItemId, quantity) {
    fetch('/api/cart', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartItemId, quantity })
    })
      .then(res => res.json())
      .then(data => {
        const [...cart] = this.state.cart;
        const index = cart.findIndex(a => a.cartItemId === data.cartItemId);
        cart.splice(index, 1, data);
        this.setState({ cart });
      });
  }

  removeFromCart(cartItemId) {
    fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartItemId })
    })
      .then(() => {
        const [...cart] = this.state.cart.filter(a => a.cartItemId !== cartItemId);
        this.setState({ cart });
      })
      .catch(err => console.error(err));
  }

  placeOrder(order) {
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(data => this.setView('confirmation', { cart: data }))
      .then(this.setState({ cart: [] }))
      .catch(err => console.error(err));
  }

  getVisits() {
    fetch('/api/visit-check')
      .then(res => res.json())
      .then(data => this.setState({ visitCount: data.visitCount }))
      .catch(err => console.error(err));
  }

  componentDidMount() {
    fetch('/api/health-check')
      .catch(err => this.setState({ message: err.message }))
      .then(() => this.getCartItems())
      .then(() => this.getVisits())
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    let view;
    switch (this.state.view.name) {
      case 'catalog':
      case 'catalogue':
        view = <ProductList
          setView={params => this.setView('details', params)}
          addToCart={productId => this.addToCart(productId)}/>;
        break;
      case 'details':
        view = <ProductDetails
          setView={() => this.setView('catalog', {})}
          productId={this.state.view.params.productId}
          addToCart={productId => this.addToCart(productId)}/>;
        break;
      case 'cart':
        view = <CartSummary
          viewCatalog={() => this.setView('catalog', {})}
          viewDetails={params => this.setView('details', params)}
          viewCheckout={() => this.setView('checkout', {})}
          modifyInCart={(cartItemId, quantity) => this.modifyInCart(cartItemId, quantity)}
          removeFromCart={cartItemId => this.removeFromCart(cartItemId)}
          cart={this.state.cart}/>;
        break;
      case 'checkout':
        view = <CheckoutForm
          viewCatalog={() => this.setView('catalog', {})}
          placeOrder={order => this.placeOrder(order)}
          cart={this.state.cart}/>;
        break;
      case 'confirmation':
        view = <CheckoutConfirmation
          viewCatalog={() => this.setView('catalog', {})}
          cart={this.state.view.params.cart}/>;
        break;
      default:
        this.setState({ error: 'An unexpected error has occured.' });
        return;
    }
    return this.state.isLoading
      ? <h1>Loading ...</h1>
      : (
        <div>
          {
            this.state.visitCount < 5 && <Notice />
          }
          <Header
            setView={() => this.setView('cart', {})}
            cartItemCount={this.state.cart.reduce((a, b) => a + b.quantity, 0)}/>
          {
            this.state.error
              ? <h2>{this.state.error}</h2> : view
          }
        </div>
      );
  }
}
