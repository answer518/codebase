/**
 * Created by zengtao on 2017/8/16.
 */
import React from 'react';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"


export default class Search extends React.Component {
    constructor(arg) {
        super(arg);
    }

    componentWillMount = ()=> {

    }

    render() {
        return (
            <div id="fakebox">
                <div id="fakebox-text">搜索Google或输入网址</div>
                <input id="fakebox-input" autoComplete="off" tabIndex="-1" type="url" />
                <div id="cursor"></div>
            </div>
        )
    }
}