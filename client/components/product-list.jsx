import React from 'react';
import ProductListItem from './product-list-item';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, message: '', products: [] };
  }

  getProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => this.setState({ products: data }))
      .catch(err => this.setState({
        error: true,
        message: err
      }));
  }

  componentDidMount() {
    this.getProducts();
  }

  render() {
    const products = this.state.products.map(
      p => <ProductListItem key={p.productId} product={p}/>
    );
    return (
      <div className="container">
        <div className="card-columns">
          {products}
        </div>
      </div>
    );
  }
}
