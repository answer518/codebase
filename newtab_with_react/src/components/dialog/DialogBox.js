import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './dialog';

const show = (props) => {
    let component = null;
    const div = document.createElement('div');
    document.body.appendChild(div);

    const onClose = () => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);

        if(typeof props.onClose === 'function') {
            props.onClose();
        }
    }

    ReactDOM.render(
        <Dialog
            {...props}
            onClose={onClose}
            ref={c => component = c}
            isOpen
        >{props.content}</Dialog>,
        div
    );
    return () => component.close();
}

const DialogBox = {};
DialogBox.confirm = (props) => show({
    ...props,
    type: 'confirm'
});

DialogBox.alert = (props) => show({
    ...props,
    type: 'alert'
});

DialogBox.error = (props) => show({
    ...props,
    type: 'error'
});

DialogBox.success = (props) => show({
    ...props,
    type: 'success'
});

export default DialogBox;