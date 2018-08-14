import React from "react";

import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from '@material-ui/core/InputLabel';

const styles = {
  formControl: {
    width: "100%"
  },
};

class Form extends React.Component {
  constructor(props) {
    super(props);

    let values = this.props.values;

    this.state = {
      values: {...values}
    };
  }

  handleChange(event) {
    let values = this.state.values;
    values[event.target.name] = event.target.value;
    this.setState(values);
  }

  handleCheck(event) {
    let values = this.state.values;
    values[event.target.name] = event.target.checked;
    this.setState(values);
  }

  textField(field, classes) {
    return (
      <FormControl className={classes.formControl}>
        <TextField
          id={field.name}
          name={field.name}
          label={field.label}
          value={this.state.values[field.name]}
          onChange={this.handleChange.bind(this)}
          type={field.type}
          {...field.options}
          fullWidth />
      </FormControl>
    );
  }

  selectField(field, classes) {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
        <Select
          value={this.state.values[field.name] || ""}
          name={field.name}
          onChange={this.handleChange.bind(this)}
          inputProps={{
            id: field.name
          }}>
          {field.items.map((item)=> {
            return <MenuItem key={item.label + item.value} value={item.value}>{item.label}</MenuItem>;
          })}
        </Select>
      </FormControl>
    );
  }

  checkbox(field, classes) {
    return (
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <Checkbox
              name={field.name}
              checked={this.state.values[field.name]}
              onChange={this.handleCheck.bind(this)}
            />
          }
          label={field.label}
        />
      </FormControl>
    );
  }

  radioGroup(field, classes) {
    return (
      <FormControl className={classes.formControl}>
        <RadioGroup
          name={field.name}
          onChange={this.handleChange.bind(this)}
          value={this.state.values[field.name]}>
          {field.items.map((item)=>{
            return (
              <FormControlLabel
                key={item.value}
                control={
                  <Radio />
                }
                label={item.label}
                value={item.value}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  }

  button(field) {
    return (
      <Button onClick={field.onClick.bind(this)} >{field.label}</Button>
    );
  }

  submitButton(field) {
    return (
      <Button type="submit" onClick={this.submit.bind(this)} >{field.label}</Button>
    );
  }

  field(field, classes) {
    switch (field.type) {
    case "date":
    case "number":
    case "text":
      return this.textField(field, classes);
    case "select":
      return this.selectField(field, classes);
    case "checkbox":
      return this.checkbox(field, classes);
    case "button":
      return this.button(field, classes);
    case "submit":
      return this.submitButton(field, classes);
    case "radio":
      return this.radioGroup(field, classes);
    default:
      return <div>Ce type d'input n'est pas pris en charge</div>;
    }
  }

  submit() {
    this.props.onSubmit(this.state.values);
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={16}>
        {this.props.fields.map((field)=>{
          if (!field.options) {
            field.options = {};
          }
          if (!field.width) {
            field.width = {xs:12};
          }
          return (
            <Grid key={field.name + field.label} item {...field.width}>
              {this.field(field, classes)}
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(Form);
