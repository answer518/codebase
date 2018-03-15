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
        console.log(this.props);
    }

    render() {

        let list = [1,2,3,4,5,6,7,8].map((data,index)=>(
            <a key={index} className="mv-empty-tile"></a>
        ))
        return (
            <div id="most-visited" className="thumb-ntp">
                <div id="mv-tiles" style={{width:680}}>
                   {list}
                </div>
            </div>
        )
    }
}