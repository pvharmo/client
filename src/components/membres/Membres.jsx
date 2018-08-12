import React from "react";
import Form from "../form/Form.jsx";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

const fields = [];

const styles = {

};

class Membres extends React.Component {
  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    return (
      <Grid container spacing={16} >
        <Grid item xs={8}>
          <Card>
            <CardHeader title="Informations du membre" />
            <CardContent>
              <Form fields={fields} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Renouvellements du membre" />
            <CardContent>
              <Form fields={fields} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Liste des membres" />
            <CardContent>
              <Form fields={fields} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}



export default withStyles(styles)(Membres);
