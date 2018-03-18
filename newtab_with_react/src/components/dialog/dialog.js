import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

        this.close = this.close.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onOkClick = this.onOkClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onChangeEvent = this.onChangeEvent.bind(this);
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
        this.props.onClose();
    }

    // 弹框关闭加了一个点击位置的判断
    onClose(e) {
        // e.nativeEvent.stopImmediatePropagation();
       var target = e && e.nativeEvent.target;
       if(target !== this.refs.modal_container) return;

       this.close();
    }

    // 点击确认回调函数
    onOkClick() {
        this.props.onOk({name: this.state.name, url: this.state.url});
        this.close();
    }
    // 点击取消的回调函数
    onCancelClick() {
        this.props.onCancel();
        this.close();
    }

    onChangeEvent(e) {
      var value = e.target.value.replace(/\s+/, '');
      if(value.length === 0) {
        // this.setState({
        //     errorClassName: 'error'
        // });
        console.log('error');
        return;
      }
      var state = {};
      state[e.target.name] = value;
      this.setState(state);
    }

    render() {
        const {
            title,
            className,
            okText,
            cancelText,
            onOk,
            onCancel,
            maskClosable,
            type
        } = this.props;

        return ( <div ref="modal_container" className={`modal-container ${className}`} onClick={maskClosable ? this.onClose : () => {}}>
                <div className="modal-body">
                    <div className={ `modal-title` }> { title } </div>
                    <div className="modal-content">
                        <div className="modal-input">
                            <label id="paper-input-label-1" htmlFor="name">名称</label>
                            <input type="input" name="name" id="name" onChange={ this.onChangeEvent }/>
                            <div className="underline">
                                <div className="unfocused-line"></div>
                                <div className="focused-line"></div>
                            </div>
                        </div>
                        <div className="modal-input">
                            <label id="paper-input-label-2" htmlFor="url">网址</label>
                            <input type="input" name="url" id="url" onChange={ this.onChangeEvent }/>
                            <div className={`underline ${this.state.errorClassName}`}>
                                <div className="unfocused-line"></div>
                                <div className="focused-line"></div>
                            </div>
                        </div>
                    </div> 
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={ this.onCancelClick }> { cancelText } </button>
                        <button className="ok-btn" onClick={ this.onOkClick }> { okText } </button>
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
