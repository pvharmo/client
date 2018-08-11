import React, {Component} from "react";
import {DragSource, DropTarget} from "react-dnd";
import flow from "lodash.flow";

import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Toc from "@material-ui/icons/Toc";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const fieldSource = {
  beginDrag(props) {
    return {id:props.schema.id};
  }
};

var lastId = "";

const fieldTarget = {
  hover(props) {
    if (props.schema.id !== lastId) {
      lastId = props.schema.id;
      props.onHover(props.schema.id);
    }
  },
  drop(props, monitor) {
    props.onHover(undefined);
    Meteor.call("moveField", props.schema.id, monitor.getItem().id);
  }
};

class SchemaSingle extends Component {

  toggleChecked() {
    var id = {};
    id.id = this.props.schema.id;
    Meteor.call("toggleShowInListSchema", id, this.props.schema.showInList);
  }

  editSchema() {
    adminActions.editField(this.props.schema);
  }

  render() {

    return flow(this.props.connectDragSource, this.props.connectDropTarget)(
      <div>
        {this.props.hover === this.props.schema.id && <Divider inset />}
        <ListItem button >
          <Checkbox
            checked={this.props.schema.showInList}
            onChange={this.toggleChecked.bind(this)}
            checkedIcon={<Visibility />} icon={<VisibilityOff />}
            disabled={this.disabledCheckbox} />
          <ListItemText primary={this.props.schema.name} secondary={this.props.schema.type} onClick={this.editSchema.bind(this)} />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete" disabled >
              <Toc style={{width:32, height: 32}} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  }
}

export default flow(DragSource("field", fieldSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})), DropTarget("field", fieldTarget, connect => ({
  connectDropTarget: connect.dropTarget()
})))(SchemaSingle);
