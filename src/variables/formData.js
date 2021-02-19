
const forms = [
    {
        id: '101',
        code: 'form-1',
        name: 'Form #1',
        order: 1,
        parentFormId: null,
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        helpCategory: 'How Can We Help?',
        helpTitle: 'Here are some tips on filling out Form 1:',
        helpDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        legal: 'The purpose of this form is to collect information about the Small Business Applicant ("Applicant") and its owners...',                
    },
    {
        id: '102',
        code: 'form-1',
        name: 'Form #1',
        order: 1,
        parentFormId: 101,
        description: 'This is a subform of Form #1 (ID: 101) ',
        helpCategory: 'How Can We Help?',
        helpTitle: 'Here are some tips on filling out Form 2:',
        helpDescription: 'From #2',
        legal: 'blah blah blah...',                
    },
]

const fields = [
    {
        id: '1001',
        code: 'field-1',
        name: "Field 1",
        fieldType: "DropDown",
        order: 1,
        parentFormId: 101,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        value: '',
        defaultValue: '',
        options: '[option1, option2, option3]',
        disabled: false,
        multiLine: false,
        size: 6 
    },
]

//fieldType: Text, Number, Currency, Decimal, Date, DropDown
//options: list of possible values in the drop down, only applies to "DropDown" fieldTypes
//value:
  
module.exports = {
    forms,
    fields,
};