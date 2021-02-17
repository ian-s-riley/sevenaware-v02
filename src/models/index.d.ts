import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Form {
  readonly id: string;
  readonly name: string;
  readonly code?: string;
  readonly description?: string;
  readonly parentFormId?: string;
  constructor(init: ModelInit<Form>);
  static copyOf(source: Form, mutator: (draft: MutableModel<Form>) => MutableModel<Form> | void): Form;
}

export declare class Field {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly value?: string;
  readonly userId?: string;
  readonly lenderId?: string;
  readonly label?: string;
  readonly helpText?: string;
  readonly image?: string;
  readonly sectionId?: string;
  constructor(init: ModelInit<Field>);
  static copyOf(source: Field, mutator: (draft: MutableModel<Field>) => MutableModel<Field> | void): Field;
}