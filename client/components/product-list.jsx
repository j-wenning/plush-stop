import React from 'react';
import ProductListItem from './product-list-item';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: '',
      products: [],
      sortOpen: false,
      sortType: 'name'
    };
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

  toggleSort() {
    this.setState({ sortOpen: !this.state.sortOpen });
  }

  sortProducts(method) {
    this.setState({
      products: this.state.products.sort((a, b) => {
        switch (method) {
          case 'name':
            if (a.name.toUpperCase() === b.name.toUpperCase()) return 0;
            else if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
            return 1;
          case 'price':
            return a.price - b.price;
          default:
            return false;
        }
      }),
      sortType: method
    });
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
    const closeSort = this.state.sortOpen ? () => this.toggleSort() : () => {};
    return (
      <div className="m-auto container" onClick={() => closeSort()}>
        <div className="col">
          <div className="row">
            <h2>Sort by</h2>
            <div className="dropdown col">
              <button
                className="btn btn-secondary dropdown-toggle text-capitalize"
                type="button"
                id="sortButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={this.state.sortOpen.toString()}
                onClick={() => this.toggleSort()}>
                {this.state.sortType}
              </button>
              <div
                className={`dropdown-menu m-0${this.state.sortOpen ? ' show' : ''}`}
                id="sortDropdown"
                aria-labelledby="sortButton"
                style={{ top: 'unset', left: 'unset' }}>
                <button
                  className="dropdown-item"
                  onClick={() => this.sortProducts('name')}>
                  Name
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => this.sortProducts('price')}>
                  Price
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 product-list">
          {
            this.state.error
              ? <h2>Error: {this.state.message}</h2> : products
          }
        </div>
      </div>
    );
  }
}
