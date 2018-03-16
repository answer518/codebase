/**
 * Created by zengtao on 2017/8/16.
 */
import React from 'react';
import Dialog from './dialog/DialogBox';

export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
        this.state = {
            list: [1,2,3,4]
        }
    }

    componentWillMount = ()=> {
        
    }

    dialog = () => {

        Dialog.confirm({
            title: '添加站点',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: (data) => {
                var list = this.state.list;

                this.setState({
                    list: []
                });
            },
            onCancel: () => {
                console.log('cancel')
            }
        })
    }

    render() {

        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                    {
                        this.state.list.map((data,index) => (
                            <a key={index} className="mv-empty-tile" onClick={ this.dialog }></a>
                        ))
                    }
                </div>
            </div>
        )
    }
}