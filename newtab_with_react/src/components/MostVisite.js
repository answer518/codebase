/**
 * Created by guotingjie on 2018/3/20.
 */
import React from 'react';
import Dialog from './dialog/DialogBox';
import Api from '../common/Api';

export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
        this.state = {
            list: [],
            mv_notice_hide: 'mv-notice-hide'
        }
    }

    componentWillMount() {}

    componentDidMount() {
        // 取后台接口
        new Api().get().then((data) => {
            this.setState({
                list: data
            })
        }).catch(function(error) {

        });
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

    xdelete(index) {
        
        var list = this.state.list;
        list.splice(index);

        this.setState({
            list: list,
            mv_notice_hide: ''
        });

        this.timer = setTimeout(() => {
            this.setState({
                mv_notice_hide: 'mv-notice-hide'
            });
        }, 3000);
    }

    mouseOver() {
        this.timer && clearTimeout(this.timer)
    }

    mouseOut() {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.setState({
                mv_notice_hide: 'mv-notice-hide'
            });
        }, 3000);
    }
    
    render() {

        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                    {
                        this.state.list.map((data,index) => {
                            if(data.url) {
                                return (<a key={index} className="mv-tile">
                                    <div className="mv-favicon">
                                        <img src={'http://localhost:8080/images/icon/' + data.logo + '.ico'} title={data.title} />
                                    </div>
                                    <div className="mv-title">{data.title || data.url}</div>
                                    <div className="mv-thumb">
                                        <img title={data.title} src={'http://localhost:8080/images/logo/' + data.logo + '.png'}/>
                                    </div>
                                    <button className="mv-x" title="不要在本页上显示" onClick={ this.xdelete.bind(this, index) }>X</button>
                                </a>)
                            } else {
                                return (<a key={index} className="mv-empty-tile" onClick={ this.dialog }></a>)
                            }
                        })
                    }
                </div>
                <div id="mv-notice" className={this.state.mv_notice_hide} onMouseOver={ this.mouseOver.bind(this) } onMouseOut={ this.mouseOut.bind(this) }>
                    <span id="mv-msg">已删除缩略图。</span>
                    <span id="mv-notice-links">
                      <span id="mv-undo" tabIndex="0">撤消</span>
                      <span id="mv-restore" tabIndex="0">全部恢复</span>
                      <div id="mv-notice-x" tabIndex="0"></div>
                    </span>
                </div>
            </div>
        )
    }
}