/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import classNames from "classnames";

//AWS Amplify GraphQL libraries
import { API } from 'aws-amplify';
import { listForms, getForm } from '../../graphql/queries';
import { createForm as createFormMutation, deleteForm as deleteFormMutation, updateForm as updateFormMutation } from '../../graphql/mutations';

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

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
const useStyles = makeStyles(styles);

const initialFormState = { 
                          name: '', 
                          code: '', 
                          order: 0, 
                          description: '', 
                          helpCategory: '',
                          helpTitle: '',
                          helpDescription: '',
                          legal: '',
                          parentFormId:  '-1', 
                          parentForm: '' }

export default function Forms() {
  const classes = useStyles()

  const [open, setOpen] = useState(null);
  const [display, setDisplay] = useState('list')
  const [forms, setForms] = useState([])
  const [form, setForm] = useState(initialFormState)

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

  async function createForm() {
    if (!form.name || !form.code) return
    const formFromAPI = await API.graphql({ query: createFormMutation, variables: { input: form } })
    const newForm = formFromAPI.data.createForm
    setForms([...forms, newForm])
    setForm(initialFormState);
    setDisplay('list')
  }
  
  async function selectForm({ id }) {
    const formFromAPI = await API.graphql({ query: getForm, variables: { id  }});       
    const thisForm = formFromAPI.data.getForm    
    setForm(thisForm)
    setDisplay('edit')    
  }  

  async function updateForm() {
    if (!form.name || !form.code) return;     
    console.log(form)   
    await API.graphql({ 
                        query: updateFormMutation, 
                        variables: { input: {
                          id: form.id, 
                          code: form.code,
                          name: form.name, 
                          order: form.order, 
                          description: form.description,
                          helpCategory: form.helpCategory,
                          helpTitle: form.helpTitle,
                          helpDescription: form.helpDescription,
                          legal: form.legal,
                          parentFormId: form.parentFormId,
                          parentForm: form.parentForm,
                        }} 
                      });
    const newFormsArray = forms.filter(updatedForm => updatedForm.id !== form.id);           
    newFormsArray.push(form)
    setForms(newFormsArray)
    setForm(initialFormState);
    setDisplay('list')
  }

  async function deleteForm({ id }) {
    var result = confirm("Are you sure you want to delete this form?");
    if (result) {      
      await API.graphql({ query: deleteFormMutation, variables: { input: { id } }});
      const newFormsArray = forms.filter(form => form.id !== id);
      setForms(newFormsArray);
      setForm(initialFormState);
      setDisplay('list')
    }        
  }

  function handleChange(e) {
      const {id, value} = e.currentTarget;
      setForm({ ...form, [id]: value})      
  }

  function handleCancel() {
      setForm(initialFormState)      
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

  function handleSelectParentForm(value, name) {
    //setParentForm(name)
    setForm({ ...form, parentFormId: value, parentForm: name})  
  }

  const formList = (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>7(a)ware Form List</h4>
      </CardHeader>
      <CardBody>
    
    <GridContainer>
        {
        forms.map(form => (
            <GridItem xs={12} sm={6} md={4} key={form.id}>
                <Card>
                    <CardHeader color="success" stats icon onClick={() => selectForm(form)}>
                    <CardIcon color="success">
                        <Icon>content_copy</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory}>{form.code}</p>
                    <h3 className={classes.cardTitle}>
                        {form.name}
                    </h3>
                    </CardHeader>
                    <CardBody>
                        {form.description}
                    </CardBody>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        Form: {form.id}
                        <br />
                        Parent Form: {form.parentForm}
                      </div>
                    </CardFooter>
                </Card>
            </GridItem>
        ))
        }        
      </GridContainer>
      </CardBody>
      <CardFooter>
        <Button 
          onClick={() => setDisplay('create')}
          color="primary"
        >New Form</Button>
      </CardFooter>
      </Card>
  )

  const formDetail = (
    <>
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Form ID: {form.id}</h4>
      </CardHeader>
      <CardBody>
      <GridContainer>
          
          
          <GridItem xs={12} sm={12} md={8}>
            <CustomInput
              labelText="Form Name"
              id="name"
              name="name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: form.name,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={4}>
          <CustomInput
              labelText="Parent Form"
              id="parentFormId"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: form.parentForm,
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
                    <Clear onClick={() => handleSelectParentForm(null, '')} />                    
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

                        forms.filter(parentForm => parentForm.id !== form.id).map(parentForm => (
                          <MenuItem
                            key={parentForm.id}
                            onClick={() => handleSelectParentForm(parentForm.id, parentForm.name)}
                            className={classes.dropdownItem}
                          >
                            {parentForm.name}
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

          <GridItem xs={12} sm={12} md={6}>
          <CustomInput
              labelText="Code"
              id="code"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: form.code,                
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
                defaultValue: form.order,                
              }}                           
            />
          </GridItem>

          


        </GridContainer>
        
           
      </CardBody>
      
    </Card>

    <Card>
      <CardBody>

      <GridContainer>          
          
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
                labelText="Description"
                id="description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  defaultValue: form.description,
                  multiline: true,
                  rows: 4
                }}
              />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Help category"
              id="helpCategory"
              name="helpCategory"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: form.helpCategory,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
                labelText="Legal"
                id="legal"
                name="legal"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  defaultValue: form.legal,
                  multiline: true,
                  rows: 4
                }}
              />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Help title"
              id="helpTitle"
              name="helpTitle"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: form.helpTitle,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
                labelText="Help Description"
                id="helpDescription"
                name="helpDescription"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  defaultValue: form.helpDescription,
                  multiline: true,
                  rows: 4
                }}
              />
          </GridItem>
          
        </GridContainer> 

      </CardBody>
      </Card>

      <Card>
      <CardFooter>
        <Button onClick={handleCancel}>Cancel</Button>        
        {
        display === 'create' ? (
        <Button 
          onClick={createForm}
          color="success"
        >Create New Form</Button>
        ) : (
          <Button 
            onClick={updateForm}
            color="success"
          >Save</Button>
        )
        }
        <Button color="danger" onClick={() => deleteForm(form)}>Delete</Button>
      </CardFooter>
      </Card>
      </>
  )
  
  return (
    display === 'list' ? formList : formDetail
  );
}
