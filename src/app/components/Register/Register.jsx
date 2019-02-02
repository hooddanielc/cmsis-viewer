import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import styles from '../../styles';
import s from './Register.scss';


class Register extends React.Component {

  getSize() {
    const {size} = this.props.data;
    if (size.charAt(0) === '0' && size.charAt(1) === 'x') {
      return parseInt(size, 16);
    }
    return parseInt(size, 10);
  }

  getTableData() {
    const tableData = [];
    const {data} = this.props;
    const accessLabels = {
      'read-only': 'r',
      'read-write': 'rw',
      'write-only': 'w',
    }
    for (let i = 0; i < this.getSize(); ++i) {
      tableData[i] = {
        name: null,
        access: null,
        bitOffset: i,
        bitWidth: 1,
        index: i,
      }
    }
    data.fields.forEach((field) => {
      const access = accessLabels[field.access];
      const bitWidth = parseInt(field.bitWidth, 10);
      const bitOffset = parseInt(field.bitOffset, 10);
      const {name, description} = field;
      for (let i = bitOffset; i < bitOffset + bitWidth; ++i) {
        tableData[i] = {
          name,
          description,
          bitWidth,
          bitOffset,
          access,
          index: i,
        }
      }
    });

    return tableData;
  }

  renderBitTableHeader(fields) {
    return (
      <thead>
        <tr>
          {fields.map(({index, name}) => (
            <th
              className={classnames({[s[`reserved`]]: !name})}
              key={`thead-${index}`}
            >
              {index}
            </th>
          )).reverse()}
        </tr>
      </thead>
    );
  }

  renderBitTableBody(fields) {
    const filtered = fields.filter(({index, bitOffset}, i) => {
      return index === bitOffset || i === 0;
    });
    return (
      <tbody>
        <tr>
          {filtered.map((field, k) => {
            const index = field.index > 15 ? field.index - 16 : field.index;
            const bitWidth = field.bitWidth + index >= 16 ? 16 - index : field.bitWidth;
            
            const cx = classnames(
              s.bitcol,
              s[`bitcol_span_${bitWidth}`],
              {[s[`reserved`]]: !field.name}
            );

            return (
              <td key={`field-${k}`} className={cx} colSpan={bitWidth}>
                {typeof field.name === 'string' ? field.name : 'N/A'}
              </td>
            );
          }).reverse()}
        </tr>
        <tr>
          {filtered.map((field, k) => {
            const index = field.index > 15 ? field.index - 16 : field.index;
            const bitWidth = field.bitWidth + index >= 16 ? 16 - index : field.bitWidth;
            const cx = classnames(s.bitcol, {[s[`reserved`]]: !field.name});

            return (
              <td key={`field-access-${k}`} className={cx} colSpan={bitWidth}>
                {typeof field.access === 'string' ? field.access : 'N/A'}
              </td>
            );
          }).reverse()}
        </tr>
      </tbody>
    );
  }

  renderBitTable(fields) {
    return fields.filter(({index, bitOffset}, i) => {
      return index === bitOffset || i === 0;
    }).map((field, i) => {
      const bitWidth = field.bitWidth > 16 ? 16 : field.bitWidth;

      const cx = classnames(
        s.bitcol,
        s[`bitcol_span_${bitWidth}`],
        {[s[`reserved`]]: !field.name}
      );
      return (
        <div className={cx} key={`first-table-${field.bitOffset}`}>
          <div className={s.bitnum}>
            
            {Array(bitWidth).fill(bitWidth).map((_, idx) => (
              <div key={`bit-num-${idx}`} style={{width: `${100 / bitWidth}%`}}>
                {field.index + idx}
              </div>
            ))}
          </div>
          <div className={s.bitname}>
            {field.name ? field.name : 'Res.'}
          </div>
          <div className={s.bitaccess}>
            {field.access || 'r'}
          </div>
        </div>
      );
    });
  }

  renderTable() {
    const data = this.getTableData();
    const first = data.slice(0, 16);
    const second = data.slice(16);
    return (
      <div className={s.field_container}>
        <table className={s.field_table}>
          {this.renderBitTableHeader(second)}
          {this.renderBitTableBody(second)}
          {this.renderBitTableHeader(first)}
          {this.renderBitTableBody(first)}
        </table>
      </div>
    );
  }

  renderSecondTable() {
    const data = this.getTableData().slice(0, 16);
    return (
      <div className={s.field_container}>
        {this.renderBitTableV2(data)}
      </div>
    );
  }

  renderFirstTable() {
    const data = this.getTableData().slice(16);
    return (
      <div className={s.field_container}>
        {this.renderBitTableV2(data)}
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    const {data} = this.props;
    return (
      <div>
        <Typography variant="title">
          {data.peripheral}_{data.name}
        </Typography>
        {this.renderTable()}
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
