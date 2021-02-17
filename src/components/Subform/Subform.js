/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import Input from "@material-ui/icons/Input";
// core components
import styles from "assets/jss/material-dashboard-react/components/subformsStyle.js";

const useStyles = makeStyles(styles);

export default function Subform(props) {
    const classes = useStyles();
    const tableCellClasses = classnames(classes.tableCell);

    return (
        <TableRow className={classes.tableRow}>
            <TableCell className={tableCellClasses}>{props.name}</TableCell>
            <TableCell className={tableCellClasses}>{props.description}</TableCell>
        </TableRow>
    );
}

Subform.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
};
