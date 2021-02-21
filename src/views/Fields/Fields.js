/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import classNames from "classnames";
import tableClassNames from "classnames";

//AWS Amplify GraphQL libraries
import { API } from 'aws-amplify';
import { listFields, getField, listForms } from '../../graphql/queries';
import { createField as createFieldMutation, deleteField as deleteFieldMutation, updateField as updateFieldMutation } from '../../graphql/mutations';

// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Danger from "components/Typography/Danger.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";

// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import Clear from "@material-ui/icons/Clear";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
const useStyles = makeStyles(styles);

const initialFieldState = { 
    name: '',
    code: '',
    description: '',
    fieldType: '',
    order: 0,
    value: '',
    defaultValue: '',
    options: '',
    userId: '',
    lenderId: '',
    label: '',
    helpText: '',
    image: '',
    formId: '',
    form: '',
}

export default function Fields() {
  const classes = useStyles()
  const tableClasses = useStyles();
  const tableCellClasses = tableClassNames(tableClasses.tableCell);

  const [open, setOpen] = useState(null);
  const [display, setDisplay] = useState('list')
  const [fields, setFields] = useState([])
  const [field, setField] = useState(initialFieldState)
  const [forms, setForms] = useState([])

  useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });

  useEffect(() => {
    fetchFields();
  }, []);

  async function fetchFields() {
    const apiData = await API.graphql({ query: listFields });
    const fieldsFromAPI = apiData.data.listFields.items;
    await Promise.all(fieldsFromAPI.map(async field => {
      return field;
    }))
    setFields(apiData.data.listFields.items);    
  }

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    const apiData = await API.graphql({ query: listForms });
    const formsFromAPI = apiData.data.listForms.items;
    await Promise.all(formsFromAPI.map(async form => {
      return form;
    }))
    setForms(apiData.data.listForms.items);    
  }

  async function createField() {
    if (!field.name || !field.code) return
    const fieldFromAPI = await API.graphql({ query: createFieldMutation, variables: { input: field } })
    const newField = fieldFromAPI.data.createField
    setFields([...fields, newField])
    setField(initialFieldState);
    setDisplay('list')
  }
  
  async function selectField({ id }) {
    const fieldFromAPI = await API.graphql({ query: getField, variables: { id  }});       
    const thisField = fieldFromAPI.data.getField    
    setField(thisField)
    setDisplay('edit')    
  }  

  async function updateField() {
    if (!field.name || !field.code) return;        
    await API.graphql({ 
                        query: updateFieldMutation, 
                        variables: { input: {
                            id: field.id, 
                            name: field.name,
                            code: field.code,
                            description: field.description,
                            fieldType: field.fieldType,
                            order: field.order,
                            value: field.value,
                            defaultValue: field.defaultValue,
                            options: field.options,
                            userId: field.userId,
                            lenderId: field.lenderId,
                            label: field.label,
                            helpText: field.helpText,
                            image: field.image,
                            formId: field.formId,
                            form: field.form,
                        }} 
                      }); 
    const newFieldsArray = fields.filter(updatedField => updatedField.id !== field.id);           
    newFieldsArray.push(field)
    setFields(newFieldsArray)
    setField(initialFieldState);
    setDisplay('list')
  }

  async function deleteField({ id }) {
    var result = confirm("Are you sure you want to delete this field?");
    if (result) {      
      await API.graphql({ query: deleteFieldMutation, variables: { input: { id } }});
      const newFieldsArray = fields.filter(field => field.id !== id);
      setFields(newFieldsArray);
      setField(initialFieldState)      
      setDisplay('list')   
    }        
  }

  function handleChange(e) {
      const {id, value} = e.currentTarget;
      setField({ ...field, [id]: value})      
  }

  function handleCancel() {
      setField(initialFieldState)      
      setDisplay('list')    
  }  

  const handleToggle = event => {
    if (open && open.contains(event.target)) {
      setOpen(null);
    } else {
      setOpen(event.currentTarget);
    }
  };

  const handleClose = () => {
    setOpen(null);
  };

  function handleSelectForm(value, name) {
    setField({ ...field, formId: value, form: name})  
  }

  const fieldList = (
    <Card>
      <CardHeader color="warning">
        <h4 className={classes.cardTitleWhite}>7(a)ware Field List</h4>
      </CardHeader>
      <CardBody>
    
    <GridContainer>
      <Table className={classes.table}>
        <TableBody>
        <TableRow>
            <TableCell className={tableCellClasses}></TableCell>
            <TableCell className={tableCellClasses}>Field Name</TableCell>
            <TableCell className={tableCellClasses}>Field Code</TableCell>
            <TableCell className={tableCellClasses}>Parent Form ID</TableCell> 
        </TableRow>
        {
        fields.map(field => (
          <TableRow className={classes.tableRow} key={field.id}>
          <TableCell className={tableCellClasses}>
            <Button 
                onClick={() => selectField(field)}
                color="primary"
            >
            Edit
            </Button>
            </TableCell>
            <TableCell className={tableCellClasses}>{field.name}</TableCell>
            <TableCell className={tableCellClasses}>{field.code}</TableCell>
            <TableCell className={tableCellClasses}>{field.formId}</TableCell>                            
        </TableRow>
        ))            
        }   
        </TableBody>
        </Table>     
      </GridContainer>
      </CardBody>
      <CardFooter>
        <Button 
          onClick={() => setDisplay('create')}
          color="warning"
        >New Field</Button>
      </CardFooter>
      </Card>
  )

  const fieldDetail = (
    <Card>
      <CardHeader color="warning">
        <h4 className={classes.cardTitleWhite}>Field ID: {field.id}</h4>
      </CardHeader>
      <CardBody>
      
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Field Name"
                id="name"
                name="name"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  defaultValue: field.name,                
                }}                           
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={4}>
            <CustomInput
                labelText="Code"
                id="code"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  defaultValue: field.code,                
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={2}>
            <CustomInput
              labelText="Order"
              id="order"
              name="order"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.order,                
              }}                           
            />
          </GridItem>

            <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Label"
              id="label"
              name="label"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.label,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Default Value"
              id="defaultValue"
              name="defaultValue"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.defaultValue,                
              }}                           
            />
          </GridItem>

            <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Field Type"
              id="fieldType"
              name="fieldType"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.fieldType,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Options"
              id="options"
              name="options"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.options,                
              }}                           
            />
          </GridItem>

          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <GridContainer>
            <GridItem>
            <CustomInput
                labelText="Parent Form"
                id="formId"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: field.form,                
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowDropDown 
                        onClick={handleToggle}
                        aria-owns={open ? "menu-list-grow" : null}
                        aria-haspopup="true" 
                      >
                        <Hidden mdUp implementation="css">
                          <p onClick={handleClose} className={classes.linkText}>
                            Parent Forms
                          </p>
                        </Hidden>
                      </ArrowDropDown>
                      <Clear onClick={() => handleSelectForm(null, '')} />                    
                    </InputAdornment>
                  ),
                  disabled: false
                }}              
              >                                
              </CustomInput>
              <Poppers
                  open={Boolean(open)}
                  anchorEl={open}
                  transition
                  disablePortal
                  className={
                    classNames({ [classes.popperClose]: !open }) +
                    " " +
                    classes.popperNav
                  }
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      id="menu-list-grow"
                      style={{
                        transformOrigin:
                          placement === "bottom" ? "center top" : "center bottom"
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList role="menu">
                          {

                          forms.map(form => (
                            <MenuItem
                              key={form.id}
                              onClick={() => handleSelectForm(form.id, form.name)}
                              className={classes.dropdownItem}
                            >
                              {form.name}
                            </MenuItem>
                          ))
                          }                                                    
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Poppers>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
                
        <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomInput
              labelText="Description"
              id="description"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: field.description,
                multiline: true,
                rows: 5
              }}
            />
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter>
        <Button onClick={handleCancel}>Cancel</Button>        
        {
        display === 'create' ? (
        <Button 
          onClick={createField}
          color="success"
        >Create New Field</Button>
        ) : (
          <Button 
            onClick={updateField}
            color="success"
          >Save</Button>
        )
        }
        <Button color="danger" onClick={() => deleteField(field)}>Delete</Button>
      </CardFooter>
    </Card>
  )
  
  return (
    display === 'list' ? fieldList : fieldDetail
  );
}
