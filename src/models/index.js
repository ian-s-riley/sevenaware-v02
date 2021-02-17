// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Form, Field } = initSchema(schema);

export {
  Form,
  Field
};