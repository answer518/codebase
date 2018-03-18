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
                list[0] = data;
                this.setState({
                    list: list
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
                        this.state.list.map((data,index) => {
                            if(data.url) {
                                return (<a key={index} className="mv-tile" onClick={ this.dialog }>
                                    <div className="mv-favicon">
                                        <img src="chrome-search://favicon/size/16@2x/2/3" title="" alt="" />
                                    </div>
                                    <div className="mv-title">{data.title || data.url}</div>
                                    <div className="mv-thumb">
                                        <img title={data.title || data.url} src="chrome-search://thumb/2/3" />
                                    </div>
                                    <button className="mv-x" title="不要在本页上显示"></button>
                                </a>)
                            } else {
                                return (<a key={index} className="mv-empty-tile" onClick={ this.dialog }></a>)
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}