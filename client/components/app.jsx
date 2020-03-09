import React from 'react';
import Navbar from './navbar';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
  }

  setView(name, params) {
    this.setState({ name, params });
  }

  componentDidMount() {
    fetch('/api/health-check')
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    let view;
    switch (this.state.view.name) {
      case 'catalog':
      case 'catalogue':
        view = <ProductList setView={params => this.setView('details', params)} />;
        break;
      case 'details':
        view = <ProductDetails />;
        break;
      default:
        this.setState({ error: 'An unexpected error has occured.' });
        return;
    }
    return this.state.isLoading
      ? <h1>Loading ...</h1>
      : (
        <div>
          <Navbar/>
          {
            this.state.error
              ? <h2>{this.state.error}</h2>
              : view
          }
        </div>

      );
  }
}
