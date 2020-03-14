import React from 'react';

export default class Notice extends React.Component {
  constructor(props) {
    super(props);
    this.state = { closed: false };
  }

  close() {
    this.setState({ closed: true });
  }

  render() {
    const closed = this.state.closed ? '' : 'show ';
    return (
      <div className={`alert alert-warning alert-dismissable fade ${closed}fixed-top`}>
        This site is a <strong>DEMO</strong> and no transactions will be fulfilled.
        <button onClick={() => this.close()} type="button" className="close" aria-label="Close">
          <i className="fas fa-times"/>
        </button>
      </div>
    );
  }
}
