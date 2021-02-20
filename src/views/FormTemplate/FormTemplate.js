import React, { useState, useEffect } from 'react';
import classNames from "classnames";

//AWS Amplify GraphQL libraries
import { API } from 'aws-amplify';
import { listFields, getForm, listForms } from '../../graphql/queries';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FixedHelp from "components/FixedHelp/FixedHelp";
import Field from 'components/Field/Field'
import Subform from 'components/Subform/Subform'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import avatar from "assets/img/help/form-help-icon-01.png";

import { TableCell, TableRow } from '@material-ui/core';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles); 
const initialFormState = { name: '' }

export default function FormTemplate() {
    const classes = useStyles();
 
    const [id, setId] = useState('eb614f56-dc15-4d08-a76f-26e11e584518');
    const [fixedClasses, setFixedClasses] = useState("dropdown");

    const [form, setForm] = useState(initialFormState)
    const [fields, setFields] = useState([])
    const [subforms, setSubforms] = useState([])
    const [formStack, setformStack] = useState([id])

    // Create a new array based on current state:
    // let newStack = [...formStack];
    // newStack.push({ value: id });
    // setformStack(newStack);
    // console.log(newStack)

    useEffect(() => {
      fetchForm();
      fetchFields();
      fetchSubforms();
    }, []);
  
    async function fetchForm() {
      //console.log('thisFormId', thisFormId)
      //console.log('formStack', formStack)
      const formFromAPI = await API.graphql({ query: getForm, variables: { id  }});            
      const thisForm = formFromAPI.data.getForm    
      setForm(thisForm)
    }

    async function fetchFields() {
      //const apiData = await API.graphql({ query: listFields, filter: {formId: {eq: "eb614f56-dc15-4d08-a76f-26e11e584518"}} });
      const apiData = await API.graphql({ query: listFields });
      const fieldsFromAPI = apiData.data.listFields.items;
      const formFields = fieldsFromAPI.filter(filteredFields => filteredFields.formId === id);
      setFields(formFields);    
    }

    async function fetchSubforms() {
      const apiData = await API.graphql({ query: listForms });
      const formsFromAPI = apiData.data.listForms.items;
      const formSubforms = formsFromAPI.filter(filteredForms => filteredForms.parentFormId === id);
      setSubforms(formSubforms);    
    }

    const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
        setFixedClasses("dropdown show");
    } else {
         setFixedClasses("dropdown");
    }
    }; 
    
    const handleNextClick = () => {
      setId('7eddfb11-b2f7-44a6-b127-b535690bd421')
    }; 


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{form.name}</h4>
              <p className={classes.cardCategoryWhite}>{form.description}</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
              {
                  fields.map(field => (
                    <Field
                      id={field.id}
                      name={field.name}
                      description={field.description}
                      value={field.value}
                      disabled={false}
                      md={6}
                      key={field.id}
                    />
                  ))
                }                   
              </GridContainer>        
            </CardBody>
            <CardFooter>
              <Button color="info">Back</Button>
              <Button color="success" onClick={handleNextClick}>Next</Button>
            </CardFooter>
          </Card>
          <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>Subforms</h4>
                    <p className={classes.cardCategoryWhite}>
                        We'll continue your appliction by getting even more information.
                    </p>
                    </CardHeader>
                    <CardBody>
                    <Table className={classes.table}>
                      <TableBody>
                      {
                        subforms.map(subform => (
                          <Subform
                            id={subform.id}
                            key={subform.id}
                            name={subform.name}
                            description={subform.description}
                          />
                        ))
                      }
                      </TableBody>
                    </Table>                      
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{form.helpCategory}</h6>
              <h4 className={classes.cardTitle}>{form.helpTitle}</h4>
              <p className={classes.description}>
                {form.helpDescription}
              </p>
              <Button color="success" round>
                more...
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <FixedHelp
          legal={form.legal}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        />
    </div>
  );
}
