import React, { Component, PropTypes } from 'react';
import { isEmpty, isEqual, isFunction, isNil } from 'lodash';
import classNames from 'classnames';
import './index.less';

const toPx = (value) => {
    let ret = `${value}`;
    if (ret.indexOf('px') > -1 || ret.indexOf('%') > -1) {
        return value;
    } else {
        return `${value}px`;
    }
};

class SimulateTable extends Component {

    static displayName = "SimulateTable";

    constructor(props){
        super(props); 
    }

    generateTheads(data, columns){
        return columns.map((col, i) => {
            const { title, className='', width } = col;
            let content = null;
            let style = width ? {width: toPx(width)} : {};

            if (React.isValidElement(title)) {
                content = React.cloneElement(title, col);
            } else if (isFunction(title)) {
                content = title(col);
            } else {
                content = title;
            }
           
            return (
                <div
                    key={`th-${i}`}
                    style={style}
                    className={`simulate-table-th ${className}`}
                >
                    {content}
                </div>
            )
        });
    }

    generateRows(data, columns){
        return data.map((item, i) => {
            return (
                <div
                    key={`row-${i}`}
                    className="simulate-table-tr clearfix"
                >
                    {this.generateTds(item, columns, i)}
                </div>
            )
        })
    }

    generateTds(item, columns, rowIndex) {
        return columns.map((col, i) => {
            const { dataKey, className='', render, width } = col;
            const value = item[dataKey];
            let content = null, title = '';
            let style = width ? {width: toPx(width)} : {};
     
            if (render) {
                if (React.isValidElement(render)) {
                    content = React.cloneElement(render, {...item, index: rowIndex});
                } else if (isFunction(render)) {
                    content = render(value, item, rowIndex);
                }
            } else {
                content = value;
            }

            title = isNil(value) ? '' : value;

            return (
                <div
                    key={`td-${rowIndex}-${i}`}
                    title={title}
                    style={style}
                    className={`simulate-table-td ${className}`}
                >
                    {content}
                </div>
            )
        })
    }

    renderFooter(footer, props){
        if (!footer) return null;
        let content = null;
        const { columns, data, ...other } = this.props;
        if (React.isValidElement(footer)){
            content = React.cloneElement(footer, {...other})
        } else if (isFunction(footer)){
            content = footer({...other});
        }

        return content;
    }

    render(){

        const { data, columns, footer, className } = this.props;
        const cls = classNames({
            'simulate-table': true,
            [className]: className
        });

        return (
            <div className={cls}>
                <div className="simulate-table-thead clearfix">
                    {this.generateTheads(data, columns)}
                </div>
                <div className="simulate-table-tbody">
                    {this.generateRows(data, columns)}
                </div>
                <div className="simulate-table-tfoot">
                    {this.renderFooter(footer, this.props)}
                </div>
            </div>
        )
    }
}

export default SimulateTable;