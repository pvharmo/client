import React from "react";
import Form from "../form/Form.jsx";
import DataTable from "mui-datatables";
import { socket } from '../../socket';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';


const styles = {

};

class Admin extends React.Component {
  constructor() {
    super();

    socket.on("error-saving", (couleur, msg)=>{
      this.setState({confEnr: true, confEnrCouleur: couleur, confEnrMsg: msg, menuSelectionne: {}});
    });

    socket.emit("get-menus");

    socket.on("set-menus-liste", (menus)=>{
      this.setState({menus});
    });

    this.state = {
      menuSelectionne: {}
    };
  }

  componentWillUnmount() {
    socket.removeListener("set-menus-liste");
  }

  submit(infos) {
    if (this.state.menuSelectionne.id) {
      socket.emit("enregistrer-option", infos);
    } else {
      socket.emit("nouvelle-option", infos);
    }
  }

  closeSnackbar() {
    this.setState({confEnr: false});
  }

  selectionnerMenu(id) {
    let found = false;
    let complete = false;
    let index = 0;
    let top = false;
    while (!found && !complete) {
      if (this.state.menus[index]) {
        if (this.state.menus[index].id === id) {
          found = true;
        } else if (!top && this.state.menus[index].id <= id) {
          index += 30;
        } else if (this.state.menus[index].id >= id) {
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
    this.setState({menuSelectionne: this.state.menus[index]});
  }

  supprimerOption() {
    socket.emit("supprimer-option", this.state.menuSelectionne.id);
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

  clearForm() {
    this.setState({menuSelectionne: {}});
  }

  render() {

    const champs = [
      {name: "etiquette", label: "Étiquette", type: "text", width:{xs: 4}},
      {name: "valeur", label: "Valeur", type: "text", width: {xs: 3}},
      {name: "nom_menu", label: "Menu", type: "select", width:{xs: 3}, items: [
        {label: "Motif", value: "motif"},
        {label: "Statut aide sociale", value: "statut"},
        {label: "Connaissance de l'ADDS", value: "connaissanceADDS"},
        {label: "Traité par", value: "traite_par"},
        {label: "Remarque de l'appel", value: "remarque_appel"}
      ]},
      {name: "archive", label: "Archiver", type: "checkbox", width: {xs:2}},
      {type: "submit", label: "Enregistrer", width: {xs: 2}},
      {type: "button", label: "Supprimer", width: {xs:2}, onClick: ()=>{this.supprimerOption();},
        confirmation: true, confirmationText: "Cette action est irréversible",
        confirmationTitle: "Êtes-vous sûr de vouloir supprimer cette option de menu?"
      },
      {type: "button", label: "Nouvelle option", width: {xs:2}, onClick: ()=>{this.clearForm();}}
    ];

    const valeurs = this.state.menuSelectionne;

    const colonnes = [
      {nom: "etiquette", label: {name: "Étiquette", options: {filter: false}}},
      {nom: "valeur", label: {name: "Valeur", options: {filter: false}}},
      {nom: "nom_menu", label: {name: "Menu", options: {customBodyRender: (value)=>{
        switch (value) {
        case "motif":
          return "Motif";
        case "statut":
          return "Statut aide sociale";
        default:
          return value;
        }
      }}}},
      {nom: "archive", label: "archivé"},
      {nom: "id", label: {name: "Éditer", options: {filter: false, customBodyRender: (value, tableMeta)=>{
        return (<IconButton index={tableMeta.columnIndex} onClick={this.selectionnerMenu.bind(this,value)}><Edit/></IconButton>);
      }}}}
    ];
    const datatable = this.datatable(colonnes, this.state.menus);
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
              <Form fields={champs} values={valeurs} onSubmit={this.submit.bind(this)} />
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
            title={"Liste des menus"}
            data={datatable.donnees}
            columns={datatable.colonnes}
            options={options}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Admin);
