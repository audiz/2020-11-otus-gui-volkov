import React from 'react';
import AbstractEdit from "../abstract/AbstractEdit";

class Authors extends AbstractEdit {
    constructor() {
        super();
        this.apiPath = '/api/authors';
        this.listName = 'authorList';
        this.pageName = 'Authors';
        this.saveName = 'Author';
    }
}
export default Authors;