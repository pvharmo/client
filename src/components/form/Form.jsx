import React, {Component} from "react";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default class NewFieldForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange(event) {
    this.setState({[event.target.name]:event.target.name})
  }

  textField(field) {
    return (
      <TextField name={field.name} onChange={this.handleChange.bind(this)} />
    )
  }

  submit() {

  }

  render() {
    var style = {};

    return (
      <form onSubmit={this.submit()}>
        {this.props.fields.map((field, index)=>{
          return this.textField({name:"test"})
        })}
      </form>
    );
  }
}
