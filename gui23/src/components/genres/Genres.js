import React from 'react';
import AbstractEdit from "../abstract/AbstractEdit";

class Genres extends AbstractEdit {
    constructor() {
        super();
        this.apiPath = '/api/genres';
        this.listName = 'genreList';
        this.pageName = 'Genres';
        this.saveName = 'Genre';
    }
}
export default Genres;