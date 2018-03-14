/**
 * Created by zengtao on 2017/5/19.
 */
import React from 'react';
import { Button, Input, Alert } from 'antd';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import * as index_act from "../../actions/index";
import { mapstate } from "../../reducers/shuju"
import MostVisite from '../public/MostVisite'
import Search from '../public/search'
import {
    Link
} from 'react-router-dom';
import history from '../public/history';
import {localStorageApi} from 'autils'

class Index extends React.Component {
    constructor(arg) {
        super(arg);
    }

    componentWillMount = () => {

    }

    tiaozhuan=()=>{
        //这是现阶段router4使用点击跳转的方式，cuns是esn的一个sessionstorage的存储，这样存储的好处是，刷新页面也不会丢失
        localStorageApi.set('canshu',"我是从首页传来的参数");
        history.push('/tui');
    }
    gaizi = (e) => {
        this.props.act_index_tit(e.target.value);
    }

    render() {
        //这里使用了嵌套路由，看不懂的，可以仔细的研究一下，对着我的写法做几次，就能理解了，不是很难
        return (
            <div className="home">
                <div id="logo" title="Google"></div>
                <Search {...this.props} />
                <MostVisite />
            </div>
        )
    }
}

function bindAct(dispatch) {
    return bindActionCreators(index_act, dispatch)
}


export default connect(mapstate, bindAct)(Index);