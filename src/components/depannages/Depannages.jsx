import React from "react";
import Form from "../form/Form.jsx";
import DataTable from "mui-datatables";
import { socket } from '../../socket';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';

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

const champsDepannage = [
  {name: "prenom", label: "Prénom", type: "text", width:{xs: 4}},
  {name: "nom", label: "Nom", type: "text", width:{xs: 4}},
  {name: "sexe", label: "Sexe", type: "select", width:{xs: 2}, items: [
    {label: "Homme", value: "H"},
    {label: "Femme", value: "F"},
    {label: "Autre", value: "A"}
  ]},
  {name: "date_naissance", label: "Date de naissance", type: "date", width: {xs: 2}},
  {name: "adresse", label: "Adresse", type: "text", width: {xs: 4}},
  {name: "appartement", label: "App.", type: "number", width: {xs: 1}},
  {name: "code_postal", label: "Code postal", type: "text", width: {xs:2}},
  {name: "ville", label: "Ville", type: "text", width: {xs:3}},
  {name: "province", label: "Province", type: "select", width: {xs:2}, items: provinces},
  {name: "telephone", label: "Téléphone", type: "text", width: {xs: 4}},
  {name: "telephone_alt", label: "Téléphone alternatif", type: "text", width: {xs: 4}},
  {name: "courriel", label: "Courriel", type: "text", width: {xs: 4}},
  // ------------------------------------------------------------------------ //
  {type: "expansion-panel", title: "Utilisation", fields:[
    // {label: "Utilisation", type: "title", variant: "title"},
    {name: "service_utilise", label: "Service utilisé", width: {xs:4}, type: "select", items: [
      {label: "Accueil", value: "accueil"},
      {label: "ADAS", value: "adas"},
      {label: "Courriel", value: "courriel"},
      {label: "Téléphone", value: "telephone"}
    ]},
    {name: "date_depannage", label: "Date", type: "datetime", width: {xs:4}},
    {name: "pour_autre_personne", label: "Pour autre personne", type: "checkbox", width: {xs:4}},
    {name: "nombre_appel", label: "Nombre d'appels", type: "number", width: {xs:4}},
    {name: "remarque_appel", label: "Remarque", type: "select", width: {xs:4}, items: [
      {label: "Répondeur", value: "repondeur"},
      {label: "Pas rejoint", value: "pas_rejoint"}
    ]},
    // {name: "repondeur", label: "Répondeur", type: "checkbox", width: {xs:4}},
    // {name: "pas_rejoint", label: "Pas rejoint", type: "checkbox", width: {xs:4}},
  ]},
  // ------------------------------------------------------------------------ //
  {type: "expansion-panel", title: "Raison", fields: [
    {type: "select", name: "raison", label: "Raison", width: {xs:3}, items:[
      {label: "Information", value: "I"},
      {label: "Problème", value: "P"}
    ]},
    {type: "select", name: "motif", label: "Motif", width: {xs:9}, items: [
      {label: "À faire", value: "test"}
    ]},
    {type: "select", name: "statut_aide_sociale", label: "Statut aide sociale", width: {xs:12}, items: [
      {label: "À faire", value: ""}
    ]},
    {type: "select", name: "situation_menage", label: "Situation du ménage", width: {xs:6}, items: [
      {label: "À faire", value: ""}
    ]},
    {type: "number", name: "nb_adultes", label: "Nombre d'adultes", width: {xs:3}},
    {type: "number", name: "nb_enfants", label: "Nombre d'enfant", width: {xs:3}},
  ]},
  // ------------------------------------------------------------------------ //
  {type: "expansion-panel", title: "Traitement", fields:[
    // {label: "Traitement", type: "title", variant: "title"},
    {type: "select", name: "connaissance_adds", label: "Connaissance de l'ADDS", width: {xs:4}, items: [
      {label: "À faire", value: ""}
    ]},
    {type: "select", name: "traite_par", label: "Traité par", width: {xs:4}, items: [
      {label: "À faire", value: "test"}
    ]},
    {type: "checkbox", name: "traite", label: "Traité", width: {xs:4}},
  ]},
  {type: "text", name: "remarques", label: "Remarques", options: {multiline: true, rows: 4}},
  // ------------------------------------------------------------------------ //
  {type: "submit", label: "Enregistrer", width: {xs: 2}},
  {type: "button", label: "Supprimer", width: {xs:2}, onClick: ()=>{this.supprimerMembre();},
    confirmation: true, confirmationText: "Cette action est irréversible",
    confirmationTitle: "Êtes-vous sûr de vouloir supprimer ce membre?"
  }
];

const valeursDepannage = {date_depannage:new Date()};

const styles = {

};

class Depannages extends React.Component {
  constructor() {
    super();

    socket.emit("get-depannages");

    socket.on("set-depannages", (depannages)=>{
      this.setState({depannages});
    });

    this.state = {
      depannageSelectionne: {}
    };
  }

  submit(infos) {
    if (this.state.depannageSelectionne.id) {
      socket.emit("enregistrer-depannage", infos);
    } else {
      socket.emit("nouveau-depannage", infos);
    }
  }

  closeSnackbar() {

  }

  selectionnerDepannage() {

  }

  datatable (colonnes, donnees) {
    let datatable = {colonnes: [], donnees: []};
    if (donnees) {

      for (let i = 0; i < colonnes.length; i++) {
        datatable.colonnes.push(colonnes[i].label);
      }
      for (let i = 0; i < donnees.length; i++) {
        let row = [];
        for (let j = 0; j < colonnes.length; j++) {
          row.push(donnees[i][colonnes[j].nom]);
        }
        datatable.donnees.push(row);
      }
    } else {
      datatable = {colonnes: [""], donnees: [[""]]};
    }
    return datatable;
  }

  render() {

    const colonnes = [
      {nom: "prenom", label: {name: "Prénom", options: {filter: false}}},
      {nom: "nom", label: {name: "Nom", options: {filter: false}}},
      {nom: "service_utilise", label: {name: "Service", options: {customBodyRender: (value)=>{
        switch (value) {
        case "accueil":
          return "Accueil";
        case "adas":
          return "ADAS";
        case "courriel":
          return "Courriel";
        case "telephone":
          return "Téléphone";
        default:

        }
        return (value);
      }}}},
      {nom: "id", label: {name: "Éditer", options: {filter: false, customBodyRender: (value, tableMeta)=>{
        return (<IconButton index={tableMeta.columnIndex} onClick={this.selectionnerDepannage.bind(this,value)}><Edit/></IconButton>);
      }}}}
    ];
    const datatable = this.datatable(colonnes, this.state.depannages);
    const options = {
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 50, 100],
      selectableRows: false,
      print: false,
      download: false
    };

    return (
      <Grid container spacing={16} >
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Form fields={champsDepannage} values={valeursDepannage} onSubmit={this.submit.bind(this)} />
              {/*<Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                open={this.state.confEnr}
                variant={this.state.confEnrCouleur}
                autoHideDuration={3000}
                onClose={this.closeSnackbar.bind(this)}
                ContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.confEnrMsg}</span>}
              />*/}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <DataTable
            title={"Liste des dépannages"}
            data={datatable.donnees}
            columns={datatable.colonnes}
            options={options}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Depannages);
