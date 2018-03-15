import React, { Component } from 'react';
import PropTypes from 'prop-types';
import util from './util';
import './dialog.scss';

const modalOpenClass = 'modal-open';

const toggleBodyClass = isOpen => {
    const body = document.body;
    if(isOpen) {
        body.classList.add(modalOpenClass);
    } else {
        body.classList.remove(modalOpenClass);
    }
}

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen || false
        };

        toggleBodyClass(props.isOpen);
        // 这一步实现了弹框关闭
        util.bindMethods(['onCancelClick', 'onOkClick', 'close'], this);
    }

    componentWillReceiveProps(nextProps) {
        if ('isOpen' in nextProps) {
            this.setState({
                isOpen: nextProps.isOpen
            });
        }
    }

    close() {
        this.state = {
            isOpen: false
        };

        toggleBodyClass(false);
    }

     // 点击确认回调函数
    onOkClick() {
        this.props.onOk();
        this.close();
    }
    // 点击取消的回调函数
    onCancelClick() {
        this.props.onCancel();
        this.close();
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
        return ( <div className={`modal-container ${className}`} onClick={maskClosable ? this.close : () => {}}>
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
