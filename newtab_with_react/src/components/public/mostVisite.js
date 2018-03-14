/**
 * Created by zengtao on 2017/8/16.
 */
import React from 'react';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"


export default class MostVisite extends React.Component {
    constructor(arg) {
        super(arg);
    }

    componentWillMount = ()=> {

    }

    render() {
        // let list = this.props.red_list.map((data,index)=>(
        //     <div key={index}>
        //         <div className="list_img"><a href={data.url} target="_blank"><img src={data.appthumb} alt=""/></a></div>
        //         <div className="list_tit">{data.title}</div>
        //         <div>{data.pubdate}</div>
        //         <div>浏览量：{data.play}</div>
        //     </div>))
        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                    <a className="mv-empty-tile"></a>
                </div>
            </div>
        )
    }
}