/**
 * Created by zengtao on 2017/8/16.
 */
import React from 'react';
import Dialog from './dialog/DialogBox';

export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
    }

    componentWillMount = ()=> {
    }

    dialog = () => {
        // Tooltip.show('the tooltip autoHide after 3s', 3000);
        Dialog.confirm({
            title: '添加站点',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                console.log('ok')
            },
            onCancel: () => {
                console.log('cancel')
            }
        })
    }

    render() {

        let list = [1,2,3,4,5,6,7,8].map((data,index)=>(
            <a key={index} className="mv-empty-tile" onClick={this.dialog}></a>
        ));

        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                   {list}
                </div>
            </div>
        )
    }
}