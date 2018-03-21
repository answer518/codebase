/**
 * Created by guotingjie on 2018/3/20.
 */
import React from 'react';
import Dialog from './dialog/DialogBox';
import ApiHandle from '../common/ApiHandle';
import CLASSES from '../common/Classes';
import Grid from './Grid';


/**
 * The last blacklisted tile rid if any, which by definition should not be
 * filler.
 * @type {?number}
 */
var lastBlacklistedTile = null;

/**
 * The browser embeddedSearch.newTabPage object.
 * @type {Object}
 */
var ntpApiHandle;

/** @type {number} @const */
var MAX_NUM_TILES_TO_SHOW = 4;

export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
        
        this.apiHandle = new ApiHandle();
        var list = this.apiHandle.mostVisited;

        list = this.apiHandle.mostVisited.splice(0, Math.min(MAX_NUM_TILES_TO_SHOW, list.length));

        this.state = {
            list: list
        }

        this.showNotification = this.showNotification.bind(this);
        this.hideNotification = this.hideNotification.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {
        // 取后台接口
        // new Api().get().then((data) => {
        //     this.setState({
        //         list: data
        //     })
        // }).catch(function(error) {
        // });
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

    onDelete(index) {
        


        var list = this.state.list;
        list.splice(index);

        this.setState({
            list: list
        });

        // 可以考虑用css3动画实现
        this.showNotification();
    }

    onUndo() {
        this.hideNotification();
        if(lastBlacklistedTile != null) {

        }
    }
 
    onRestoreAll() {
        this.hideNotification();
    }

    showNotification() {
        var notification = this.refs.notification;
        notification.classList.remove(CLASSES.HIDE_NOTIFICATION);
        notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
        notification.scrollTop;
        notification.classList.add(CLASSES.DELAYED_HIDE_NOTIFICATION);
    }

    hideNotification() {
        var notification = this.refs.notification;
        notification.classList.add(CLASSES.HIDE_NOTIFICATION);
        notification.classList.remove(CLASSES.DELAYED_HIDE_NOTIFICATION);
    }
    
    render() {

        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                    {
                        this.state.list.map((data,index) => {
                            if(data) {
                                return <Grid key={index} onDeleteClick={ this.onDelete.bind(this, index) } item={data}/>
                            } else {
                                return (<a key={index} className="mv-empty-tile" onClick={ this.dialog }></a>)
                            }
                        })
                    }
                </div>
                <div id="mv-notice" className="mv-notice-hide" ref="notification">
                    <span id="mv-msg">已删除缩略图。</span>
                    <span id="mv-notice-links">
                      <span id="mv-undo" tabIndex="0" onClick={ this.onUndo.bind(this) }>撤消</span>
                      <span id="mv-restore" tabIndex="0" onClick={ this.onRestoreAll.bind(this) }>全部恢复</span>
                      <div id="mv-notice-x" tabIndex="0"></div>
                    </span>
                </div>
            </div>
        )
    }
}