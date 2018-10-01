import React from "react";
import Form from "../form/Form.jsx";
import DataTable from "mui-datatables";
import { socket } from '../../socket';
import moment from "moment";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Edit from '@material-ui/icons/Edit';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';

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

};

class Depannages extends React.Component {
  constructor() {
    super();

    socket.on("error-saving", (couleur, msg)=>{
      this.setState({confEnr: true, confEnrCouleur: couleur, confEnrMsg: msg});
    });

    socket.emit("get-depannages");
    socket.emit("get-menus", ["motif", "statut", "connaissanceADDS", "traite_par", "remarque_appel"]);

    socket.on("set-depannages", (depannages)=>{
      this.setState({depannages});
    });

    socket.on("set-menus", (values)=>{
      let motif = [];
      let statut = [];
      let connaissanceADDS = [""];
      let traitePar = [];
      let remarqueAppel = [""];
      let arrondissement = [""];
      for (let i = 0; i < values.length; i++) {
        if (values[i].nom_menu === "motif") {
          motif.push(values[i]);
        }
        else if (values[i].nom_menu === "statut") {
          statut.push(values[i]);
        }
        else if (values[i].nom_menu === "connaissanceADDS") {
          connaissanceADDS.push(values[i]);
        }
        else if (values[i].nom_menu === "traite_par") {
          traitePar.push(values[i]);
        }
        else if (values[i].nom_menu === "remarque_appel") {
          remarqueAppel.push(values[i]);
        }
        else if (values[i].nom_menu === "arrondissement") {
          arrondissement.push(values[i]);
        }
      }
      this.setState({statut, motif, connaissanceADDS, traitePar, remarqueAppel, arrondissement});
    });

    this.state = {
      depannageSelectionne: {},
      statut: [],
      motif: [],
      traitePar: [],
      connaissanceADDS: [],
      remarqueAppel: [],
      arrondissement: []
    };
  }

  componentWillUnmount() {
    socket.removeListener("set-menus");
    socket.removeListener("set-depannages");
  }

  submit(infos) {
    if (this.state.depannageSelectionne.id) {
      socket.emit("enregistrer-depannage", infos);
    } else {
      if (infos.date_depannage) {
        infos.date_depannage = infos.date_depannage.format("YYYY-MM-DD HH:mm:ss");
      } else {
        infos.date_depannage = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      console.log(infos);
      socket.emit("nouveau-depannage", infos);
    }
  }

  closeSnackbar() {
    this.setState({confEnr: false});
  }

  clearForm() {
    this.setState({depannageSelectionne: {}});
  }

  selectionnerDepannage(id) {
    let found = false;
    let complete = false;
    let index = 0;
    let top = false;
    while (!found && !complete) {
      if (this.state.depannages[index]) {
        if (this.state.depannages[index].id === id) {
          found = true;
        } else if (!top && this.state.depannages[index].id <= id) {
          index += 30;
        } else if (this.state.depannages[index].id >= id) {
          top = true;
          --index;
        } else {
          complete = true;
          index = -1;
        }
      } else {
        --index;
      }
    }
    this.setState({depannageSelectionne: this.state.depannages[index]});
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

  supprimerDepannage() {
    socket.emit("supprimer-depannage", this.state.depannageSelectionne.id);
    this.clearForm();
  }

  render() {

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
      {name: "code_postal", label: "Code postal", type: "text", width: {xs:2}},
      {name: "ville", label: "Ville", type: "text", width: {xs:2}},
      {name: "arrondissement", label: "Arrondissement", type: "select", width:{xs:2}, items: this.state.arrondissement},
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
        {name: "nombre_appel", label: "Nombre d'appels", type: "number", width: {xs:4}},
        {name: "intervenant", label: "Intervenant", type: "select", width: {xs:4}, items: [
          {label: "Aucun", value: ""},
          {label: "Intervenant", value: "intervenant"},
          {label: "Organisme", value: "organisme"},
          {label: "Autre", value: "autre"}
        ]},
        {name: "nom_intervenant", label: "Nom de l'intervenant", type: "text", width: {xs:4}},
        {name: "remarque_appel", label: "Remarque", type: "select", width: {xs:4}, items: this.state.remarqueAppel},
      ]},
      // ------------------------------------------------------------------------ //
      {type: "expansion-panel", title: "Raison", fields: [
        {type: "select", name: "raison", label: "Raison", width: {xs:3}, items:[
          {label: "Information", value: "I"},
          {label: "Problème", value: "P"}
        ]},
        {type: "select", name: "motif", label: "Motif", width: {xs:9}, items: this.state.motif},
        {type: "select", name: "statut_aide_sociale", label: "Statut aide sociale", width: {xs:12}, items: this.state.statut},
        {type: "select", name: "situation_menage", label: "Situation du ménage", width: {xs:6}, items: [
          {label: "Célibataire", value: "celibataire"},
          {label: "Couple", value:"couple"},
          {label: "Unifamilial", value: "unifamilial"}
        ]},
        {type: "number", name: "nb_adultes", label: "Nombre d'adultes", width: {xs:3}},
        {type: "number", name: "nb_enfants", label: "Nombre d'enfant", width: {xs:3}},
      ]},
      // ------------------------------------------------------------------------ //
      {type: "expansion-panel", title: "Traitement", fields:[
        {type: "select", name: "connaissance_adds", label: "Connaissance de l'ADDS", width: {xs:4}, items: this.state.connaissanceADDS},
        {type: "select", name: "traite_par", label: "Traité par", width: {xs:4}, items: this.state.traitePar},
        {type: "checkbox", name: "traite", label: "Traité", width: {xs:4}},
      ]},
      {type: "text", name: "remarques", label: "Remarques", options: {multiline: true, rows: 4}},
      // ------------------------------------------------------------------------ //
      {type: "submit", label: "Enregistrer", width: {xs: 2}},
      {type: "button", label: "Supprimer", width: {xs:2}, onClick: ()=>{this.supprimerDepannage();},
        confirmation: true, confirmationText: "Cette action est irréversible",
        confirmationTitle: "Êtes-vous sûr de vouloir supprimer ce membre?"
      },
      {type: "button", label: "Nouveau dépannage", width: {xs:2}, onClick: ()=>{this.clearForm();}}
    ];

    const valeursDepannage = this.state.depannageSelectionne;

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
      {nom: "date_depannage", label: {name: "Date", options: {customBodyRender: (value)=>{
        let date = new Date(value);
        return date.toLocaleString("fr-FR", {});
      }}}},
      {nom: "traite_par", label: "Traité par"},
      {nom: "traite", label: {name: "Traité", options: {customBodyRender: (value)=>{
        if (value == 1) {
          return <Done />;
        } else {
          return <Close />;
        }
      }}}},
      {nom: "raison", label: {name: "Raison", options: {customBodyRender: (value)=>{
        if (value == "P") {
          return "Problème";
        } else {
          return "Information";
        }
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
              <Snackbar
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
              />
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
