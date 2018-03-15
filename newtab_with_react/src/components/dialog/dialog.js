import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './dialog.scss';

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen || false
        };
    }
    componentWillReceiveProps(nextProps) {
        if ('isOpen' in nextProps) {
            this.setState({
                isOpen: nextProps.isOpen
            });
        }
    }
    render() {
        const {
            title,
            children,
            className,
            okText,
            cancelText,
            onOk,
            onCancel,
            maskClosable,
            type
        } = this.props;
        return ( <div className = { `modal-container ${className}` }>
                <div className="modal-body" >
                    <div className={ `modal-title ${type}` }> { title } </div>
                    <div className="modal-content"> { children } </div> 
                    <div className="modal-footer">
                        <button className="ok-btn" onClick={ onOk }> { okText } </button>
                        <button className="cancel-btn" onClick={ onCancel }> { cancelText } </button>
                    </div> 
                </div>
            </div>
        );
    }
}

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    className: PropTypes.string,
    maskClosable: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    okText: PropTypes.string,
    cancelText: PropTypes.string
};

Dialog.defaultProps = {
    className: '',
    maskClosable: true,
    onCancel: () => {},
    onOk: () => {},
    okText: 'OK',
    cancelText: 'Cancel'
};
