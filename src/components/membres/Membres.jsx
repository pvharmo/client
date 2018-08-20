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



const styles = {
  paper: {
    maxHeight: 244,
    overflow: "scroll"
  }
};

class Membres extends React.Component {
  constructor() {
    super();

    this.membreVide = {
      id: undefined, nom: "", prenom: "", adresse: "", province: "",
      ville: "", code_postal: "", date_naissance: "0000-00-00",
      sexe: "", telephone: "", telephone_alt: "", courriel: "", info_courriel: false,
      info_poste: false, actif: true, militant: false, regulier: false, commentaires: ""
    };

    socket.emit("get-liste-membres");
    socket.on("set-liste-membres", (listeMembres)=> {
      this.setState({listeMembres});
    });
    socket.on("set-liste-renouvellements", (listeRenouvellements)=> {
      this.setState({listeRenouvellements});
    });
    socket.on("error-saving", (couleur, msg)=>{
      this.setState({confEnr: true, confEnrCouleur: couleur, confEnrMsg: msg, membreSelectionne: {...this.membreVide}});
    });

    this.state = {
      renouvellementSelectionne: {},
      membreSelectionne: {...this.membreVide},
      renouvellement: false
    };
  }

  submit(values) {
    if (this.state.membreSelectionne.id) {
      socket.emit("modifier-membre", values);
    } else {
      this.setState({renouvellement: true, infosMembre: values});
    }
  }

  toggleDialog() {
    this.setState({renouvellement: !this.state.renouvellement});
  }

  enregistrerRenouvellement(values) {
    if (this.state.membreSelectionne.id) {
      socket.emit("renouvellement", this.state.membreSelectionne.id, values, this.state.membreSelectionne.regulier);
    } else {
      socket.emit("nouveau-membre", this.state.infosMembre, values);
    }
    this.setState({renouvellement: false});
  }

  dataTable(donnees, colonnes) {
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

  supprimerMembre() {
    socket.emit("supprimer-membre", this.state.membreSelectionne.id);
    this.setState({membreSelectionne: {...this.membreVide}});
  }

  selectionnerMembre(id) {
    let found = false;
    let complete = false;
    let index = 0;
    let top = false;
    while (!found && !complete) {
      if (this.state.listeMembres[index]) {
        if (this.state.listeMembres[index].id === id) {
          found = true;
        } else if (!top && this.state.listeMembres[index].id <= id) {
          index += 30;
        } else if (this.state.listeMembres[index].id >= id) {
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
    socket.emit("get-liste-renouvellement", this.state.listeMembres[index].id);
    this.setState({membreSelectionne: this.state.listeMembres[index]});
  }

  supprimerRenouvellement(id) {
    let confirm = window.confirm("Êtes-vous sûr de vouloir supprimer ce renouvellement? Cette action est irréversible.");
    if (confirm) {
      socket.emit('supprimer-renouvellement', id, this.state.membreSelectionne.id);
    }
  }

  closeSnackbar() {
    this.setState({confEnr: false});
  }

  render() {

    const champsMembre = [
      {name: "prenom", label: "Prénom", type: "text", width:{xs: 4}},
      {name: "nom", label: "Nom", type: "text", width:{xs: 4}},
      {name: "sexe", label: "Sexe", type: "select", width:{xs: 2}, items: [
        {label: "Homme", value: "H"},
        {label: "Femme", value: "F"},
        {label: "Autre", value: "A"}
      ]},
      {name: "date_naissance", label: "Date de naissance", type: "date", width: {xs: 2}},
      {name: "adresse", label: "Adresse", type: "text", width: {xs: 4}},
      {name: "appartement", label: "App.", type: "text", width: {xs: 1}},
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
      {type: "button", label: "Supprimer", width: {xs:2}, onClick: ()=>{this.supprimerMembre();},
        confirmation: true, confirmationText: "Cette action est irréversible",
        confirmationTitle: "Êtes-vous sûr de vouloir supprimer ce membre?"
      }
    ];
    const values = this.state.membreSelectionne;

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


    const options = {
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 50, 100],
      selectableRows: false,
      print: false,
      download: false
    };

    const colonnesMembres = [
      {nom: "prenom", label: {name: "Prénom", options: {filter: false}}},
      {nom: "nom", label: {name: "Nom", options: {filter: false}}},
      {nom: "info_poste", label: "Poste"},
      {nom: "info_courriel", label: "Courriel"},
      {nom: "actif", label: "Actif"},
      {nom: "militant", label: "Militant"},
      {nom: "regulier", label: "Type"},
      {nom: "id", label: {name: "Éditer", options: {filter: false, customBodyRender: (value, tableMeta)=>{
        return (<IconButton index={tableMeta.columnIndex} onClick={this.selectionnerMembre.bind(this,value)}><Edit/></IconButton>);
      }}}}
    ];

    const colonnesRenouvellements = [
      {nom: "date_renouvellement", label: "Date"},
      {nom: "regulier", label: "Régulier"},
      // {nom: "dons", label: "Dons"},
      {nom: "commentaires", label: "Commentaires"},
      {nom: "id", label: {name: "Supprimer", options: {customBodyRender: (value, tableMeta)=>{
        return (<IconButton index={tableMeta.columnIndex} onClick={this.supprimerRenouvellement.bind(this,value)}><Clear color="secondary"/></IconButton>);
      }}}}
    ];

    const datatable = this.dataTable(this.state.listeMembres, colonnesMembres);
    const renouvellements = this.dataTable(this.state.listeRenouvellements, colonnesRenouvellements);
    const optionsListeRenouvellement = {
      filter: false,
      sort: false,
      selectableRows: false,
      print: false,
      download: false,
      rowHover: false,
      rowsPerPage: 6,
      rowsPerPageOptions: [6, 12, 24]
    };

    return (
      <Grid container spacing={16} >
        <Grid item xs={7}>
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
        <Grid item xs={5}>
          {this.state.listeRenouvellements &&
            <DataTable
              title={<div style={{display: "flex", alignItems: "center"}}>
                Liste des renouvellements
                <IconButton onClick={this.toggleDialog.bind(this)}><Add color="primary" aria-label="Renouvellement" /></IconButton>
              </div>}
              data={renouvellements.donnees}
              columns={renouvellements.colonnes}
              options={optionsListeRenouvellement}
            />
          }

        </Grid>
        <Grid item xs={12}>
          {this.state.listeMembres &&
            <DataTable
              title={"Liste des membres"}
              data={datatable.donnees}
              columns={datatable.colonnes}
              options={options}
            />
          }
        </Grid>
      </Grid>
    );
  }
}



export default withStyles(styles)(Membres);
