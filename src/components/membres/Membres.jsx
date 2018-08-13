import React from "react";
import Form from "../form/Form.jsx";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

const fields = [
  {name: "prenom", label: "Prénom", type: "text", width:{xs: 4}},
  {name: "nom", label: "Nom", type: "text", width:{xs: 4}},
  {name: "sexe", label: "Sexe", type: "select", width:{xs: 2}, items: [
    {label: "Homme", value: "Homme"},
    {label: "Femme", value: "Femme"},
    {label: "Autre", value: "Autre"}
  ]},
  {name: "date_naissance", label: "Date de naissance", type: "date", width: {xs: 2}},
  {name: "adresse", label: "Adresse", type: "text", width:{xs: 4}},
  {name: "code_postal", label: "Code postal", type: "text", width: {xs:4}},
  {name: "ville", label: "Ville", type: "text", width: {xs:4}},
  {name: "province", label: "Province", type: "select", width: {xs:4}, items: [
    {label: "Québec", value: "QC"},
    {label: "Alberta", value: "AB"},
    {label: "Colombie-Britannique", value: "BC"},
    {label: "Île-du-Prince-Édouard", value: "PE"},
    {label: "Manitoba", value: "MB"},
    {label: "Nouveau-Brunswick", value: "NB"},
    {label: "Nouvelle-Écosse", value: "NS"},
    {label: "Ontario", value: "ON"},
    {label: "Saskatchewan", value: "SK"},
    {label: "Terre-Neuve-et-Labrador", value: "NL"},
    {label: "Nunavut", value: "NU"},
    {label: "Territoires du Nord-Ouest", value: "NT"},
    {label: "Yukon", value: "YK"},
    {label: "Extérieur du Canada", value: "EX"}
  ]},
  {name: "radioTest", label: "test radio", type: "radio", items: [
    {label: "1", value: "1"},
    {label: "2", value: "2"},
    {label: "3", value: "3"}
  ]},
  {name: "submit", type: "submit", label: "Enregistrer"}
];
const values = {prenom: ""};

const styles = {

};

class Membres extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  submit(values) {
    console.log(values);
  }

  render() {
    return (
      <Grid container spacing={16} >
        <Grid item xs={8}>
          <Card>
            <CardHeader title="Informations du membre" />
            <CardContent>
              <Form fields={fields} values={values} onSubmit={this.submit.bind(this)} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Renouvellements du membre" onSubmit={this.submit.bind(this)} />
            <CardContent>
              <Form fields={fields} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Liste des membres" onSubmit={this.submit.bind(this)} />
            <CardContent>
              <Form fields={fields} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}



export default withStyles(styles)(Membres);
