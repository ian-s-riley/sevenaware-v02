/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import classnames from "classnames";

//AWS Amplify GraphQL libraries
import { API } from 'aws-amplify';
import { listForms, getForm, listFields } from '../../graphql/queries';
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
import Subform from 'components/Subform/Subform'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

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
import { TableRow, TableCell, TableFooter } from '@material-ui/core';
import { supportsHistory } from 'history/DOMUtils';

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

export default function FormDetail() {
  const history = useHistory();
  const classes = useStyles();
  const tableCellClasses = classnames(classes.tableCell);

  const formId = history.location.state.formId
  const parentFormId = history.location.state.parentFormId
  console.log('formId', formId)
  console.log('parentFormID',parentFormId)

  const [form, setForm] = useState(initialFormState)
  const [subforms, setSubforms] = useState([])
  const [fields, setFields] = useState([])  

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
    fetchForm()
    fetchSubforms()
    fetchFields()
  }, [formId])

  async function fetchForm() {
      if (formId === '') {
          setForm(initialFormState)
          setForm({ ...initialFormState, parentFormId: parentFormId})
      } else {
        const formFromAPI = await API.graphql({ query: getForm, variables: { id: formId  }});       
        const thisForm = formFromAPI.data.getForm    
        setForm(thisForm)      
      }
  }  

  async function fetchSubforms() {
    const apiData = await API.graphql({ query: listForms, variables: { filter: {parentFormId: {eq: formId}} } });
    const formsFromAPI = apiData.data.listForms.items;    
    setSubforms(formsFromAPI)
  }

  async function fetchFields() {
    const apiData = await API.graphql({ query: listFields, variables: { filter: {formId: {eq: formId}} } });
    const fieldsFromAPI = apiData.data.listFields.items;
    await Promise.all(fieldsFromAPI.map(async field => {
      return field;
    }))
    setFields(apiData.data.listFields.items);    
  }

  async function createForm() {
    if (!form.name || !form.code) return
    console.log('createForm: form', form)
    await API.graphql({ query: createFormMutation, variables: { input: form } })
    history.goBack()  
  }

  async function updateForm() {
    if (!form.name || !form.code) return;       
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
    //go back to the list or the parent form
    history.goBack()
  }

  async function deleteForm({ id }) {
    var result = confirm("Are you sure you want to delete this form?");
    if (result) {      
      await API.graphql({ query: deleteFormMutation, variables: { input: { id } }});
      history.goBack()
    }        
  }

  function handleChange(e) {
      const {id, value} = e.currentTarget;
      setForm({ ...form, [id]: value})      
  }

  function handleCancel() {
      history.goBack()   
  }  

  async function handleSelectSubform({ id, parentFormId }) { 
    history.push("/admin/formdetail", { formId: id, parentFormId: parentFormId }) 
  }  

  function handleCreateSubform() {
    history.push("/admin/formdetail", { formId: '', parentFormId: formId }) 
}  

  async function previewForm({ id, name }) {
    //console.log('name', name)      
    history.push("/admin/formtemplate", { formId: id })
  }
  
  return (
    <>
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Form ID: {form.id}</h4>
      </CardHeader>
      <CardBody>
      <GridContainer>                    
          <GridItem xs={12} sm={12} md={5}>
            <CustomInput
              labelText="Form Name"
              id="name"
              name="name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                value: form.name,                
              }}                           
            />
          </GridItem>          
          <GridItem xs={12} sm={12} md={5}>
          <CustomInput
              labelText="Code"
              id="code"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                value: form.code,                
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
                value: form.order,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
                labelText="Description"
                id="description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  value: form.description,
                  multiline: true,
                  rows: 4
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
              labelText="Help category"
              id="helpCategory"
              name="helpCategory"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                value: form.helpCategory,                
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
                value: form.helpTitle,                
              }}                           
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
                labelText="Help Description"
                id="helpDescription"
                name="helpDescription"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  value: form.helpDescription,
                  multiline: true,
                  rows: 4
                }}
              />
          </GridItem>

          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
                labelText="Legal"
                id="legal"
                name="legal"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (event) => handleChange(event),
                  value: form.legal,
                  multiline: true,
                  rows: 4
                }}
              />
          </GridItem>                             
        </GridContainer>         
      </CardBody>
      <CardFooter>
        <Button onClick={handleCancel}>Cancel</Button>        
        {
        formId === '' ? (
        <Button 
          onClick={createForm}
          color="success"
        >Save New Form</Button>
        ) : (
          <>
          <Button 
            onClick={updateForm}
            color="success"
          >Save</Button>
          <Button color="danger" onClick={() => deleteForm(form)}>Delete</Button>
          </>
        )
        }                
      </CardFooter>
      </Card>
      {(formId !== '') && (
      <>
      <Card>
        <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>Subforms</h4>                    
                    </CardHeader>
                    <CardBody>
                    <Table className={classes.table}>
                      <TableBody>
                      {
                        subforms.map(subform => (
                          <TableRow className={classes.tableRow} key={subform.id}>
                          <TableCell className={tableCellClasses}>
                            <Button 
                                onClick={() => handleSelectSubform(subform)}
                                color="success"
                            >
                            Edit
                            </Button>
                            </TableCell>
                            <TableCell className={tableCellClasses}>
                            <Button 
                                onClick={() => previewForm(subform)}
                                color="info"
                            >
                            Preview
                            </Button>
                            </TableCell>
                            <TableCell className={tableCellClasses}>{subform.name}</TableCell>
                            <TableCell className={tableCellClasses}>{subform.description}</TableCell>                            
                        </TableRow>
                        ))
                      }
                      </TableBody>
                      <TableFooter>
                      <TableRow className={classes.tableRow}>
                          <TableCell className={tableCellClasses}>
                            <Button 
                              onClick={handleCreateSubform}
                              color="primary"
                            >New Subform</Button>
                            </TableCell>
                            <TableCell className={tableCellClasses}></TableCell>
                            <TableCell className={tableCellClasses}></TableCell>                            
                        </TableRow>
                      </TableFooter>
                    </Table>                      
                    </CardBody>
                    <CardFooter>
                    
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="info">
                    <h4 className={classes.cardTitleWhite}>Fields</h4>                    
                    </CardHeader>
                    <CardBody>
                    <Table className={classes.table}>
                      <TableBody>
                      {
                        fields.map(field => (
                          <TableRow className={classes.tableRow} key={field.id}>                            
                            <TableCell className={tableCellClasses}>{field.name}</TableCell>
                            <TableCell className={tableCellClasses}>{field.fieldType}</TableCell>                            
                            <TableCell className={tableCellClasses}>{field.id}</TableCell>                            
                        </TableRow>
                        ))
                      }
                      </TableBody>
                    </Table>                      
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
        </CardBody>
      </Card>
      </>
      )}
      </>
  )
}
