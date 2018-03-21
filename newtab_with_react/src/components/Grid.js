/**
 * Created by guotingjie on 2018/3/20.
 */
import React from 'react';
import CLASSES from '../common/Classes';

export default class Grid extends React.Component {
    constructor(arg) {
        super(arg);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    componentDidMount = () => {
    }

    onDeleteClick() {
        
        var thiz = this;
        var tile = thiz.refs.mv_tile;
        tile.classList.add(CLASSES.GRID_MOVED);
        tile.addEventListener('transitionend', function(ev) {
            if (ev.propertyName != 'width')
              return;
            
            thiz.props.onDeleteClick();
        });
    }

    render() {
        const {
            item,
            index
        } = this.props;
        return (
            <a key={index} className="mv-tile" ref="mv_tile">
                <div className="mv-favicon">
                    <img src={'/images/icon/' + item.logo + '.ico'} title={item.title} />
                </div>
                <div className="mv-title">{item.title || item.url}</div>
                <div className="mv-thumb">
                    <img title={item.title} src={'/images/logo/' + item.logo + '.png'}/>
                </div>
                <button className="mv-x" title="不要在本页上显示" onClick={ this.onDeleteClick }>X</button>
            </a>
        )
    }
}