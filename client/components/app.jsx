import React from 'react';
import Navbar from './navbar';
import ProductList from './product-list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      error: false,
      isLoading: true,
      products: []
    };
  }

  getProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => this.setState({ products: data }))
      .catch(err => this.setState({
        message: err.message,
        error: true
      }));
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({
        message: err.message,
        error: true
      }))
      .then(this.getProducts())
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    return this.state.isLoading
      ? <h1>Loading ...</h1>
      : (
        <div className="container-fluid">
          <Navbar/>
          {
            this.state.error
              ? <h1>{this.state.message}</h1>
              : <ProductList products={this.state.products}/>
          }
        </div>

      );
  }
}
