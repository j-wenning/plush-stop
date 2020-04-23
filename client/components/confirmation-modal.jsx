import React from 'react';

export default class ComfirmationModal extends React.Component {
  render() {
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.primaryText}</h5>
              <button
                type="button"
                className="close"
                onClick={this.props.close}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary text-capitalize"
                data-dismiss="modal"
                onClick={this.props.secondaryAction.action}>
                {this.props.secondaryAction.text}
              </button>
              <button
                type="button"
                className={`btn ${this.props.primaryAction.color || 'btn-primary'} text-capitalize`}
                onClick={this.props.primaryAction.action}>
                {this.props.primaryAction.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
