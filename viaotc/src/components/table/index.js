import React, { Component } from 'react'
import propTypes from 'prop-types';
import {Table} from 'antd'
import "./index.less"
import  {isString} from 'lodash'
import axios from 'utils/request'

export default class CustomTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading:true,
			data:[],
			total:'',
			page:this.props.page
		};
		this.onChange = this.onChange.bind(this)
	}

	static defaultProps = {
		title :'',
		pageSize:10,
		total:0,
		pagination:true,
		param:{},
		url:'',
		page:1,

	};

	componentDidMount(){
		this.getData()
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.url !== this.props.url || JSON.stringify(nextProps.param) !== JSON.stringify(this.props.param)
			|| this.props.forceUpdateTime !== nextProps.forceUpdateTime){
			this.getData(nextProps.url,nextProps.param)
		}
	}

	getData( url = this.props.url, param = this.props.param){
		this.setState({
			loading:true
		});
		let {pagination,tableKey} = this.props;
		let params = pagination ?{...param,page:this.state.page}:param;
		axios.get(url,params).then(
			d => {
				let data = d.data;
				this.setState({
					data:data[tableKey],
					loading:false,
					total:data.total ? data.total : 0
				})
			}
		)
	}

	renderTitle (){
		let {title,extral} =  this.props;
		return (
			<div className = "table-title">
				<span className="left-title">{title}</span>
				{ extral?
					<div className= "fr right-extral">
						{extral}
					</div>
					:null }
			</div>
			)
	}

	onChange(page){
		this.setState({
			page:page.current
		},()=>{
			this.getData()
		})
	}

	render(){
		let {title ,className,columns,pageSize,pagination,others} = this.props;
		let {data,total,loading} = this.state;

		return (
			<Table
				{...others}
				columns = {columns}
				className = 'assert-table'
				title = {()=> this.renderTitle()}
				dataSource  = {data}
				pagination = {pagination?{total,pageSize,size: 'small'}:false}
				onChange = {this.onChange}
				loading =  {loading }
			/>
		)
	}
}
