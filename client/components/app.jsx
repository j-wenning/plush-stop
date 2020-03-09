import React from 'react';
import Navbar from './navbar';
import ProductList from './product-list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: '', isLoading: true };
  }

  componentDidMount() {
    fetch('/api/health-check')
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    return this.state.isLoading
      ? <h1>Loading ...</h1>
      : (
        <div>
          <Navbar/>
          {
            this.state.error
              ? <h2>{this.state.error}</h2>
              : <ProductList />
          }
        </div>

      );
  }
}
