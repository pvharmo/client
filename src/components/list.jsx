
import React from "react";
import ReactDOM from "react-dom";

import SchemaSingle from "./SchemaSingle.jsx";
import SchemaTopToolbar from "./SchemaTopToolbar.jsx";

import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {Scrollbars} from "react-custom-scrollbars";
import List from "@material-ui/core/List";

class SchemasWrapper extends React.Component {

  constructor() {
    super();

    this.update = this.update.bind(this);

    this.state = {
      dropdown: [0],
      newSchemaDialog: false,
      newSchemaName: "",
      alert: false,
      editSchemaText: "",
      entity: ""
    };
  }

  fields() {
    return Schemas.find({entity: adminStore.getStructure().entity}, {sort: {order:1}}).fetch();
  }

  onHover(id) {
    this.setState({hover:id});
  }

  render() {
    var height = window.innerHeight - 203;

    return (
      <div className="row" >
        <SchemaTopToolbar entity={this.state.entity} />
        <div id="schema-fields-list">
          <Scrollbars style={{width: "100%", height}} >
            <List>
              {this.fields().map( (schema)=>{
                return (<SchemaSingle
                  key={schema.id}
                  schema={schema}
                  onHover={this.onHover.bind(this)}
                  hover={this.state.hover} />);
              })}
            </List>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(SchemasWrapper);
