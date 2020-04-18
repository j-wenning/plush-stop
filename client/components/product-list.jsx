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
      p => <ProductListItem
        key={p.productId}
        product={p}
        setView={() => this.props.setView({
          productId: p.productId
        })}
        addToCart={() => this.props.addToCart(p.productId)}/>
    );
    return (
      <div className="m-auto container row row-cols-1 row-cols-sm-2 row-cols-md-3 product-list">
        {
          this.state.error
            ? <h2>Error: {this.state.message}</h2> : products
        }
      </div>
    );
  }
}
