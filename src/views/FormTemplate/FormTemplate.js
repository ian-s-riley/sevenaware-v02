import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import classnames from "classnames";

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import { searchFields, getForm, searchForms } from '../../graphql/queries';
import { updateForm as updateFormMutation } from '../../graphql/mutations';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";

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

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";


import avatar from "assets/img/help/form-help-icon-01.png";

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
    const history = useHistory();
    const classes = useStyles();
    const tableCellClasses = classnames(classes.tableCell);
 
    const formId = history.location.state.formId
    const [fixedClasses, setFixedClasses] = useState("dropdown");

    const [form, setForm] = useState(initialFormState)
    const [fields, setFields] = useState([])
    const [subforms, setSubforms] = useState([])

    useEffect(() => {
      fetchForm();
      fetchFields();
      fetchSubforms();
    }, [formId]);
  
    async function fetchForm() {
      const formFromAPI = await API.graphql({ query: getForm, variables: { id: formId  }});            
      setForm(formFromAPI.data.getForm )
    }

    async function fetchFields() {  
      const apiData = await API.graphql(graphqlOperation(searchFields, {
        filter: { formId: { match: formId }},
        sort: {
          direction: 'asc',
          field: 'order'
        }
      }));
      const fieldsFromAPI = apiData.data.searchFields.items 
      setFields(fieldsFromAPI);  
    }

    async function fetchSubforms() {
      const apiData = await API.graphql(graphqlOperation(searchForms, {
        filter: { parentFormId: { match: formId }},
        sort: {
          direction: 'asc',
          field: 'order'
        }
      }));
      const formsFromAPI = apiData.data.searchForms.items 
      setSubforms(formsFromAPI);  
    }

    async function handleSaveForm() {      
      await API.graphql({ 
                          query: updateFormMutation, 
                          variables: { input: {
                            id: form.id, 
                            isComplete: 'true',
                          }} 
                        });
      handleNextClick()
    }

    const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
        setFixedClasses("dropdown show");
    } else {
         setFixedClasses("dropdown");
    }
    };     

    async function handleNextClick() {  
      //get the forms & subforms
      const apiData = await API.graphql(graphqlOperation(
        searchForms, {
          filter: {             
            or: [
              { parentFormId: { match: formId } },
              { parentFormId: { match: form.parentFormId } }
            ],
            and: [
              { isComplete: { eq: ''} }
            ]
          },
          sort: {
            direction: 'asc',
            field: 'order'
          }
        }
        ))       
      const formsFromAPI =  apiData.data.searchForms.items      
      console.log('handleNextClick: formsFromAPI', formsFromAPI)

      //go to the next incomplete subform of this form, if there is one
      const subFormsArray = formsFromAPI.filter(subform => subform.parentFormId === formId);
      if (subFormsArray.length > 0) {
        console.log('history.push', subFormsArray[0].id)
        history.push("/admin/formtemplate", { formId: subFormsArray[0].id })
      } else { 
        //no sub forms, go to the next sibling form (unless we are a top level form)
        if (form.parentFormId === '-1') {
          console.log('history.push', 'admin/forms')
          history.push("/admin/forms")
        } else {
          //go to the next incomplete subform of this form's parent form, if there is one
          const siblingFormsArray = formsFromAPI.filter(siblingform => siblingform.parentFormId === form.parentFormId);
          if (siblingFormsArray.length > 0) {
            console.log('history.push', siblingFormsArray[0].id)
            history.push("/admin/formtemplate", { formId: siblingFormsArray[0].id })
          } else { 
            //no incomplete sub or sibling forms, go to the parent form            
            console.log('history.push', form.parentFormId)      
            history.push("/admin/formtemplate", { formId: form.parentFormId })          
          }
        }                
      }            
    }

    function handleBackClick() {    
      history.goBack()
    }    


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
              <Button color="info" onClick={handleBackClick}>Back</Button>
              <Button color="success" onClick={handleSaveForm}>Save</Button>
              <Button color="info" onClick={handleNextClick}>Next</Button>
            </CardFooter>
          </Card>
          <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>Subforms</h4>
                    <p className={classes.cardCategoryWhite}>
                        We'll continue your appliction by getting more information.
                    </p>
                    </CardHeader>
                    <CardBody>
                    <Table className={classes.table}>
                      <TableBody>
                      {
                        subforms.map(subform => (
                          <TableRow className={classes.tableRow} key={subform.id}>
                            <TableCell className={tableCellClasses}>{subform.name}</TableCell>
                            <TableCell className={tableCellClasses}>{subform.description}</TableCell>
                            <TableCell className={tableCellClasses}>
                              <Checkbox
                                checked={subform.isComplete !== ''}
                                checkedIcon={<Check className={classes.checkedIcon} />}
                                icon={<Check className={classes.uncheckedIcon} />}
                                classes={{
                                  checked: classes.checked,
                                  root: classes.root
                                }}
                              />
                            </TableCell>
                        </TableRow>
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
