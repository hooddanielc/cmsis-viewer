import fs from 'fs';
import path from 'path';
import React from 'react';
import {Link} from 'react-router-dom';
const svd_path = path.resolve(__dirname, '..', '..', '..', '..', 'cmsis-svd', 'data');

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.filepath = path.join(svd_path, props.name);
    if (!fs.existsSync(this.filepath)) {
      this.state = {error: true}
    } else {
      this.state = {loading: true}
    }
  }

  componentDidMount() {
    fs.readdir(this.filepath, (err, res) => {
      if (err) {
        throw err;
      }
      const links = res.filter((p) => path.extname(p) === '.svd');
      this.setState({loading: false, links});
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
            <Link
              key={`link-by-chip-${i}`}
              to={`/cmsis/${this.props.name}/chip/${link}`}
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}