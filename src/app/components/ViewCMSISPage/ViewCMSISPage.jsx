import path from 'path';
import fs from 'fs';
import React from 'react';
import xml2js from 'xml2js';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import styles from '../../styles';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import PeripheralList from '../PeripheralList/PeripheralList';
import SplitPane from 'react-split-pane';
import Page from '../Page/Page';
import s from './ViewCMSISPage.scss';
import Register from '../Register/Register';
import {GDB} from 'gdb-js';
import {load} from '../../actions/gdb';
import GDBToolbar from '../../containers/GDBToolbarContainer';

function Info({data, classes}) {
  const rows = [];
  Object.keys(data.device).forEach((k) => {
    const item = data.device[k];
    if (k === 'name') {
      return;
    }
    if (item && item.length === 1 && item[0] && typeof item[0] !== 'object') {
      rows.push([k, item[0]]);
    }
  });

  return (
    <header>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        {data.device.name[0]}
      </Typography>
      <Table className={classes.table}>
        <TableBody>
          {rows.map(([key, val]) => (
            <TableRow key={`table-row-${key}`}>
              <TableCell component="th" scope="row">{key}</TableCell>
              <TableCell align="right">{val}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </header>
  );
}

function CpuInfo({data, classes}) {
  const rows = [];
  Object.keys(data).forEach((k) => {
    const item = data[k];
    if (k === 'name') {
      return;
    }
    if (item && item.length === 1 && item[0] && typeof item[0] !== 'object') {
      rows.push([k, item[0]]);
    }
  });

  return (
    <header>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        CPU
      </Typography>
      <Table className={classes.table}>
        <TableBody>
          {rows.map(([key, val]) => (
            <TableRow key={`table-row-${key}`}>
              <TableCell component="th" scope="row">{key}</TableCell>
              <TableCell align="right">{val}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </header>
  );
}

class ViewCMSISPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedRegisters: [],
    }
  }

  componentDidMount() {
    const {chip, company} = this.props.match.params;
    const svd_path = path.resolve(__dirname, '..', '..', '..', '..', 'cmsis-svd', 'data');
    fs.readFile(path.join(svd_path, company, chip), (err, res) => {
      if (err) {
        this.setState({err});
      } else {
        xml2js.parseString(res.toString(), (err, data) => {
          if (err) {
            this.setState({err});
          } else {
            this.setState({data})
          }
        });
      }
    });
  }

  load() {
    this.props.dispatch(load({filepath}));
  }

  getPeripheralList(peripherals) {
    const derivations = {}

    return peripherals.map((peripheral) => {
      const top = {};
      Object.keys(peripheral).map((k) => {
        const item = peripheral[k];
        if (!item[0]) {
          top[k] = item;
        } else {
          top[k] = item[0];
        }
      });

      const result = {}

      const {
        addressBlock,
        baseAddress,
        description,
        groupName,
        name,
        registers,
        $
      } = top;

      if (addressBlock) {
        result.addressBlock = {
          offset: addressBlock.offset[0],
          size: addressBlock.size[0],
          usage: addressBlock.usage[0],
        }
      }

      result.baseAddress = baseAddress;
      result.groupName = groupName;
      result.name = name;
      result.description = top.description;

      if (top.$) {
        result.$ = top.$;
      }

      if (peripheral.interrupt) {
        result.interrupt = peripheral.interrupt.map((i) => ({
          description: i.description ? i.description[0] : '',
          name: i.name[0],
          value: i.value[0],
        }));
      }

      if (top.registers && top.registers.register) {
        result.registers = top.registers.register.map((register) => {
          const reg_result = {}
          const reg_top = {}
          Object.keys(register).map((k) => {
            const item = register[k];
            if (!item[0]) {
              reg_top[k] = item;
            } else if (typeof item[0] !== 'object') {
              reg_result[k] = item[0];
            } else {
              reg_top[k] = item[0];
            }
          });

          if (reg_top.fields) {
            reg_result.fields = reg_top.fields.field.map((f) => {
              const f_top = {}
              Object.keys(f).map((k) => {
                const item = f[k];
                if (!item[0]) {
                  f_top[k] = item;
                } else {
                  f_top[k] = item[0];
                }
              });
              if (!f_top.access) {
                f_top.access = reg_result.access;
              }
              return f_top;
            });
          }

          reg_result.peripheral = result.name;
          return reg_result;
        });
      }

      derivations[result.name] = result;

      if (result.$ && result.$.derivedFrom) {
        const derived = derivations[result.$.derivedFrom];
        Object.keys(derived).forEach((k) => {
          if (!result[k] && derived[k]) {
            result[k] = derived[k];
          }
        });
      }

      return result;
    });
  }

  onSelectItem({peripheral, register}) {
    const id = `${peripheral.name}_${register.name}`;
    const acquired = this.state.selectedRegisters.filter((reg) => {      
      return id === `${peripheral.name}_${reg.name}`;
    }).length > 0;
    if (!acquired) {
      this.setState({
        selectedRegisters: this.state.selectedRegisters.concat([register]),
      });
    }
  }

  render() {
    const {classes} = this.props;
    const {company} = this.props.match.params;

    if (!this.state.data) {
      return null;
    }

    const peripherals = this.getPeripheralList(this.state.data.device.peripherals[0].peripheral);

    return (
      <Page>
        <SplitPane className={s.container} minSize={375} style={{position: 'relative'}} split="vertical">
            <div className={s.leftpane}>
              <Paper>
                <PeripheralList onSelectItem={this.onSelectItem.bind(this)} peripherals={peripherals} />
              </Paper>
              <Paper>
                <Info data={this.state.data} classes={classes} />
              </Paper>
              <Divider />
              <Paper>
                {this.state.data.device.cpu && <CpuInfo data={this.state.data.device.cpu[0]} classes={classes} />}
              </Paper>
            </div>
            <div className={s.rightpane}>
              <Paper>
                <GDBToolbar />
                {this.state.selectedRegisters.map((data, i) => {
                  return (
                    <Register key={`register-${i}`} data={data} />
                  );
                })}
              </Paper>
            </div>
        </SplitPane>
      </Page>
    );
  }
}

ViewCMSISPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewCMSISPage);
