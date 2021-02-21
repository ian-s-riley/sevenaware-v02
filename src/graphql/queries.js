/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getForm = /* GraphQL */ `
  query GetForm($id: ID!) {
    getForm(id: $id) {
      id
      name
      code
      order
      description
      helpCategory
      helpTitle
      helpDescription
      legal
      parentFormId
      parentForm
      createdAt
      updatedAt
    }
  }
`;
export const listForms = /* GraphQL */ `
  query ListForms(
    $filter: ModelFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        code
        order
        description
        helpCategory
        helpTitle
        helpDescription
        legal
        parentFormId
        parentForm
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getField = /* GraphQL */ `
  query GetField($id: ID!) {
    getField(id: $id) {
      id
      name
      code
      description
      fieldType
      order
      size
      value
      defaultValue
      options
      userId
      lenderId
      label
      helpText
      image
      formId
      form
      createdAt
      updatedAt
    }
  }
`;
export const listFields = /* GraphQL */ `
  query ListFields(
    $filter: ModelFieldFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        code
        description
        fieldType
        order
        size
        value
        defaultValue
        options
        userId
        lenderId
        label
        helpText
        image
        formId
        form
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
