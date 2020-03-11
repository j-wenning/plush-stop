import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';

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
      cart: []
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
      }));
  }

  addToCart(product) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: Number(product.productId) })
    })
      .then(res => res.json())
      .then(data => this.setState({
        cart: [...this.state.cart, data]
      }));
  }

  componentDidMount() {
    fetch('/api/health-check')
      .catch(err => this.setState({ message: err.message }))
      .then(() => this.getCartItems())
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    let view;
    switch (this.state.view.name) {
      case 'catalog':
      case 'catalogue':
        view = <ProductList
          setView={params => this.setView('details', params)}/>;
        break;
      case 'details':
        view = <ProductDetails
          setView={() => this.setView('catalog', {})}
          productId={this.state.view.params.productId}
          addToCart={productId => this.addToCart(productId)}/>;
        break;
      case 'cart':
        view = <CartSummary
          setView={() => this.setView('catalog', {})}
          cart={this.state.cart}/>;
        break;
      default:
        this.setState({ error: 'An unexpected error has occured.' });
        return;
    }
    return this.state.isLoading
      ? <h1>Loading ...</h1>
      : (
        <div>
          <Header
            setView={() => this.setView('cart', {})}
            cartItemCount={this.state.cart.length}/>
          {
            this.state.error
              ? <h2>{this.state.error}</h2>
              : view
          }
        </div>

      );
  }
}
