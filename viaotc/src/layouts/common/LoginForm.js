import React, { PropTypes, Component } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router';
// import { empty } from 'utils/util';
import FormButton from './FormButton';
import ajax from '../../utils/fetch';
// import { getErrorMsg } from 'utils/util';
// import MD5 from 'md5';

const FormItem = Form.Item;

class LoginForm extends Component { 

	static displayName = 'LoginForm';

	constructor(props){
		super(props);
		this.state = {
			err_times: 0,
			timeStamp: Date.now(),
			msg: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.refreshCode = this.refreshCode.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.userLogin = this.userLogin.bind(this);
	}

	refreshCode(){
		this.setState({timeStamp: Date.now()});
	}	

	userLogin(param){
		const { onLoginSuccess } = this.props;
		ajax.post('/api/login', param)
			.then((response) => {
				const { error, err_times, msg='' } = response;
				if (error != 0) {
					const errorMsg = getErrorMsg(msg);
					this.setState({err_times: Number(err_times), timeStamp: Date.now(), msg: errorMsg})
				} else {
					window.location.reload();
					//onLoginSuccess && onLoginSuccess();
				}
			});
	}

	handleSubmit(e){
		e && e.preventDefault();
		this.setState({msg: ''});
	    this.props.form.validateFields((err, values) => {	
	      if (!err) {
	        const { password, ...other } = values;
	        this.userLogin({password: MD5(password), ...other});
	      }
	    });
	}

	handleKeyDown(e){
		if (e.keyCode == 13){
			this.handleSubmit();
		}
	}

	render(){
		
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { err_times, timeStamp, msg } = this.state;
		const { phone, password } = getFieldsValue();
		const isDisabled = !(phone && password);

		return (
			<div className="login-register-block">
				<input type="password" style={{display: 'none'}} name="login_password"/>
				<div className="login-form"> 
				   <div className="login-form-title">
				   		<h1>快速登录</h1>
				   		<Link to="/app/entrance/register" className="form-title-link">注册账号</Link>
				   </div>
				<div 
					className="form-content otc-form"
					onKeyDown={this.handleKeyDown}
				>
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('phone', {
									rules: [
										{required: true, message: '请填写手机号！'},
										{pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入合法的手机号!'}
									]
								})(
									<Input placeholder="请填写手机号"/>
								)
							}
						</FormItem>						
					</div>
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('password', {
									rules: [{required: true, message: '请填写密码！'}]
								})( 
									<Input type="password"  placeholder="请填写密码" name="login_password"/>
								)
							}
						</FormItem>							
					</div>
					{err_times > 2 &&
						<div className="form-item form-item-relative form-item-captcha">
							<FormItem>
								{
									getFieldDecorator('captcha', {
										rules: [{required: true, message: '请输入验证码！'}]
									})(
										<Input placeholder="请输入验证码"/>
									)
								}
							</FormItem>
							<div className="captcha-code">
								<img 
									src={`/api/captcha?${timeStamp}`} 
									onClick={this.refreshCode}
								/>						
							</div>
						</div>} 	
				     <FormButton
				     	style={{marginTop: '10px'}}
				     	text="登录"
				     	isDisabled={isDisabled}
				     	error={msg}
				     	onSubmit={this.handleSubmit}
				     	errorTime={timeStamp}
				     />       
					<div className="form-item form-login-tip">
						<Link to="/app/entrance/forgot/step1" style={{color: '#999'}}>忘记密码？</Link>						
					</div>					      			
					</div>					   	
				</div>
			</div>
		)
	}
}

export default Form.create()(LoginForm);
