import fs from 'fs';
import path from 'path';
import React from 'react';
import {Link} from 'react-router-dom';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const svd_path = path.resolve(__dirname, '..', '..', '..', '..', 'cmsis-svd', 'data');
    fs.readdir(svd_path, (err, res) => {
      if (err) {
        throw err;
      }
      this.setState({links: res});
    });
  }

  render() {
    if (!this.state.links) {
      return null;
    }
    return (
      <ul>
        {this.state.links.map((link, i) => (
          <li>
            <Link key={`link-by-comp-${i}`} to={`/cmsis/${link}`}>{link}</Link>
          </li>
        ))}
      </ul>
    );
  }
}