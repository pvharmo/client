import React from "react";
import Form from "../form/Form.jsx";
import DataTable from "../dataTable/DataTable.jsx";
import { socket } from '../../socket';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const provinces = [
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
];



const styles = {
  paper: {
    maxHeight: 244,
    overflow: "scroll"
  }
};

class Membres extends React.Component {
  constructor() {
    super();

    socket.emit("get-liste-clients");

    this.state = {
      renouvellementSelectionne: {},
      membreSelectionne: {},
      renouvellement: false
    };
  }

  submit(values) {
    if (this.state.membreSelectionne.id) {
      socket.emit("modifier-membre");
    } else {
      this.setState({renouvellement: true, infosMembre: values});
    }
  }

  toggleDialog() {
    this.setState({renouvellement: !this.state.renouvellement});
  }

  enregistrerRenouvellement(values) {
    if (this.state.membreSelectionne.id) {
      socket.emit("renouvellement", this.state.membreSelectionne.id, values);
    } else {
      socket.emit("nouveau-membre", this.state.infosMembre, values);
    }
    this.setState({renouvellement: false});
  }

  render() {
    const { classes } = this.props;

    const champsMembre = [
      {name: "prenom", label: "Prénom", type: "text", width:{xs: 4}},
      {name: "nom", label: "Nom", type: "text", width:{xs: 4}},
      {name: "sexe", label: "Sexe", type: "select", width:{xs: 2}, items: [
        {label: "Homme", value: "H"},
        {label: "Femme", value: "F"},
        {label: "Autre", value: "A"}
      ]},
      {name: "date_naissance", label: "Date de naissance", type: "date", width: {xs: 2}},
      {name: "adresse", label: "Adresse", type: "text", width:{xs: 4}},
      {name: "appartement", label: "Appartement", type: "number", width:{xs: 1}},
      {name: "code_postal", label: "Code postal", type: "text", width: {xs:2}},
      {name: "ville", label: "Ville", type: "text", width: {xs:3}},
      {name: "province", label: "Province", type: "select", width: {xs:2}, items: provinces},
      {name: "telephone", label: "Téléphone", type: "text", width: {xs: 4}},
      {name: "telephone_alt", label: "Téléphone alternatif", type: "text", width: {xs: 4}},
      {name: "courriel", label: "Courriel", type: "text", width: {xs: 4}},
      {name: "info_poste", label: "Poste", type: "checkbox", width: {xs: 3}},
      {name: "info_courriel", label: "Courriel", type: "checkbox", width: {xs: 3}},
      {name: "actif", label: "Actif", type: "checkbox", width: {xs: 2}},
      {name: "militant", label: "Militant", type: "checkbox", width: {xs: 2}},
      {name: "regulier", label: "Type", type: "select", width:{xs:2}, items: [
        {label: "Régulier", value: "TRUE"},
        {label: "Sympathisant", value: "FALSE"}
      ]},
      {name: "commentaires", label: "Commentaires", type: "text", options: {multiline: true, rows: 4}},
      {type: "submit", label: "Enregistrer", width: {xs: 2}},
    ];
    const values = {province: "QC"};

    let date_renouvellement = "Date d'inscription";

    if (this.state.membreSelectionne.id) {
      if (!this.state.renouvellementSelectionne.inscription) {
        date_renouvellement = "Date de renouvellement";
      }
    }

    let champsRenouvellement = [
      {name: "dons", label: "Dons", type: "text"},
      {name: "date_renouvellement", label: date_renouvellement, type: "date"},
      {name: "commentaires", label: "Commentaires", type: "text", options: {multiline: true, rows: 8}},
      {label: "Renouveller", type: "submit", width: {xs:3}},
      {type: "button", label: "Annuler", onClick: ()=>{this.toggleDialog();}, width: {xs:3}}
    ];
    const valeursRenouvellement = {};

    return (
      <Grid container spacing={16} >
        <Grid item xs={10}>
          <Card>
            <CardHeader title="Informations du membre" />
            <CardContent>
              <Form fields={champsMembre} values={values} onSubmit={this.submit.bind(this)} />
              <Dialog open={this.state.renouvellement}>
                <DialogTitle>{this.state.membreSelectionne.id ? "Renouvellement" : "Inscription"}</DialogTitle>
                <DialogContent>
                  <Form
                    fields={champsRenouvellement}
                    values={valeursRenouvellement}
                    onSubmit={this.enregistrerRenouvellement.bind(this)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card >
            <CardHeader title="Renouvellements du membre" />
            <CardContent>
              <Button onClick={this.toggleDialog.bind(this)}>Renouvellement</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Liste des membres" />
            <CardContent>
              {/*<Form fields={fields} />*/}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}



export default withStyles(styles)(Membres);
