import React from 'react';
import Product from './product';

export default class ProductList extends React.Component {
  render() {
    return this.props.products.map(p => <Product key={p.productId} item={p}/>);
  }
}
