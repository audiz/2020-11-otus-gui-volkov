export const fetchHandler = (apiUrl, headers, callOk, callError ) => fetch(apiUrl, headers)
    .then( response => {
        if (!response.ok) { throw response }
        return response.text().then(function(text) {
            return text ? JSON.parse(text) : {}
        })
    })
    .then( json => {
        callOk(json)
    }).catch( err => {
        return err.json()
    }).then( json => {
        callError(json)
    });