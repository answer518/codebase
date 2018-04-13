/**
 * Created by guotingjie on 2018/3/20.
 */
import React from 'react';
import Dialog from './dialog/DialogBox';
import ApiHandle from '../common/ApiHandle';
import CLASSES from '../common/Classes';
import Constant from '../common/Constant';
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

export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
        
        this.apiHandle = new ApiHandle();
        var list = this.apiHandle.mostVisited;
        list = this.apiHandle.mostVisited.splice(0, Math.min(Constant.MAX_NUM_TILES_TO_SHOW, list.length));

        this.state = {
            list: list
        }

        this.onDelete = this.onDelete.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.onRestoreAll = this.onRestoreAll.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.hideNotification = this.hideNotification.bind(this);
    }

    componentDidMount() {
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

    onDelete(rid) {
        var thiz = this;

        // 可以考虑用css3动画实现
        this.showNotification();
        lastBlacklistedTile = rid;

        this.apiHandle.deleteMostVisitedItem(rid);

        // 重新
        setTimeout(() => {
            const list = thiz.state.list.filter(function(item) {
                return item.rid !== rid;
            });

            thiz.setState({
                list: list
            });
        }, 500);
    }

    onUndo() {
        this.hideNotification();
        if (lastBlacklistedTile != null) {

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

        const grids = this.state.list.map((item,index) => {
                        return <Grid key={index} onDeleteClick={ this.onDelete } item={item} onAddClick={ this.dialog }/>
                    })
        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                    {grids}
                </div>
                <div id="mv-notice" className="mv-notice-hide" ref="notification">
                    <span id="mv-msg">已删除缩略图。</span>
                    <span id="mv-notice-links">
                      <span id="mv-undo" tabIndex="0" onClick={ this.onUndo }>撤消</span>
                      <span id="mv-restore" tabIndex="0" onClick={ this.onRestoreAll }>全部恢复</span>
                      <div id="mv-notice-x" tabIndex="0"></div>
                    </span>
                </div>
            </div>
        )
    }
}