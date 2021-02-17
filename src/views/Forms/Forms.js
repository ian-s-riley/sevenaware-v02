/*eslint-disable*/
import React, { useState, useEffect } from 'react';

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

// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import People from "@material-ui/icons/People";

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

import { users } from 'variables/userData'
const initialFormState = { name: '', code: '', description: '' }

export default function Views() {
  const classes = useStyles()

  const [display, setDisplay] = useState('list')
  const [forms, setForms] = useState([])
  const [form, setForm] = useState()
  const [formData, setFormData] = useState(initialFormState)

  const user = users[0]

  React.useEffect(() => {
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

  function newForm() {
    setDisplay('create')
  }

  async function createForm() {
    if (!formData.name || !formData.code) return
    const newForm = await API.graphql({ query: createFormMutation, variables: { input: formData } })
    setForms([...forms, newForm.data.createForm])
    setFormData(initialFormState);
    setDisplay('list')
  }
  
  async function selectForm(formId) {
    const formFromAPI = await API.graphql({ query: getForm, variables: { id: formId  }});       
    const thisForm = formFromAPI.data.getForm    
    setForm(thisForm)
    console.log(thisForm)
    setDisplay('edit')
  }  

  async function saveForm() {
    if (!formData.name || !formData.code) return;
    console.log('form', formData)
    await API.graphql({ query: updateFormMutation, variables: { input: {id: formData.id, name: formData.name, code: formData.code, description: formData.description} } });
    //await API.graphql({ query: createFormMutation, variables: { input: {id: form.id, name: form.name, description: form.description} } });
    setFormData(initialFormState);
    setDisplay('list')
  }

  async function deleteForm({ id }) {
    const newFormsArray = forms.filter(form => form.id !== id);
    setForms(newFormsArray);
    await API.graphql({ query: deleteFormMutation, variables: { input: { id } }});
  }

  function handleChange(e) {
      const {id, value} = e.currentTarget;
      setFormData({ ...formData, [id]: value})      
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
                    <CardHeader color="success" stats icon onClick={() => selectForm(form.id)}>
                    <CardIcon color="success">
                        <Icon>content_copy</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory}>{form.id}</p>
                    <h3 className={classes.cardTitle}>
                        {form.name}
                    </h3>
                    </CardHeader>
                    <CardBody>
                        {form.description}
                    </CardBody>
                    <CardFooter stats>
                    <button onClick={() => deleteForm(form)}>Delete note</button>
                  </CardFooter>
                </Card>
            </GridItem>
        ))
        }        
      </GridContainer>
      </CardBody>
      <CardFooter>
        <Button 
          onClick={newForm}
          color="primary"
        >New Form</Button>
      </CardFooter>
      </Card>
  )

  const formDetail = (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>7(a)ware Forms</h4>
      </CardHeader>
      <CardBody>
      <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Form Name"
              id="name"
              name="name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: (event) => handleChange(event),
                defaultValue: formData.name,
                endAdornment: (
                  <InputAdornment position="end">
                    <People />
                  </InputAdornment>
                )
              }}              
            />
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
                defaultValue: formData.code,
              }}
            />
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
                defaultValue: formData.description,
                multiline: true,
                rows: 5
              }}
              onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            />
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter>
        <Button onClick={() => {setDisplay('list')}}>Cancel</Button>
        <Button 
          onClick={createForm}
          color="primary"
        >Save</Button>
      </CardFooter>
    </Card>
  )
  
  return (
    display === 'list' ? formList : formDetail
  );
}
