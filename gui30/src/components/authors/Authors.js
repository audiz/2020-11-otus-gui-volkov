import React from 'react';
import AbstractEdit from "../abstract/AbstractEdit";

class Authors extends AbstractEdit {
    constructor() {
        super();
        this.apiPath = '/datarest/authors';
        this.listName = 'authors';
        this.pageName = 'Authors';
        this.saveName = 'Author';
    }
}
export default Authors;