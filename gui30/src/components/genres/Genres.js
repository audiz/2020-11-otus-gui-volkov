import React from 'react';
import AbstractEdit from "../abstract/AbstractEdit";

class Genres extends AbstractEdit {
    constructor() {
        super();
        this.apiPath = '/datarest/genres';
        this.listName = 'genres';
        this.pageName = 'Genres';
        this.saveName = 'Genre';
    }
}
export default Genres;