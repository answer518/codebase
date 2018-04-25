import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'antd';

class FormButton extends Component {

	static displayName = 'FormButton';

	constructor(props){
		super(props);
		this.state = {
			error: props.error || ''
		};
		this.timer = null;
	};

	static propTypes = {
		isDisabled: PropTypes.bool,
		onSubmit: PropTypes.func
	};

	static defaultProps = {
		isDisabled: false,
		type: 'primary',
		text: '确定'
	};

	componentWillReceiveProps(nextProps){
		if (nextProps.error && this.props.errorTime !== nextProps.errorTime){
			if (this.timer) {clearTimeout(this.timer)};
			this.setState({error: nextProps.error}, () => {
				this.timer = setTimeout(() => {
					this.setState({error: ''});
				}, 800);
			});
		}
	}

	render(){
		const { isDisabled, onSubmit, className, type, text, style } = this.props;
		const { error } = this.state;
		const styles = style ? {position: 'relative', ...style} : {position: 'relative'}
		const cls = classNames({
			'form-item': true,
			'form-button-wrap': true,
			[className]: className
		});
		const btnCls = classNames({
			'disabled': isDisabled
		});

		return (
			<div className={cls} style={styles}>
				<div className="error-tip">{error}</div>
				<Button 
					type={type} 
					className={btnCls}
					disabled={isDisabled}
					onClick={onSubmit}
				>{text}</Button>
			</div>
		)
		
	}
}

export default FormButton