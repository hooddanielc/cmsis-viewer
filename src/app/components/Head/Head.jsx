import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

export default ({classes}) => {
  return (
    <div>
      <Toolbar className={classes.toolbarMain}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          CMSIS Viewer
        </Typography>
      </Toolbar>
    </div>
  );
}
