export const fetchHandler = (apiUrl, headers, callOk, callError ) => fetch(apiUrl, headers)
    .then( response => {
        if(response.status === 403) {
            return {code: 403, message: "Forbidden"};
        }
        if(response.redirected){
            var parser = document.createElement('a');
            parser.href = response.url;
            if(parser.pathname === "/login") {
                window.location = response.url;
            }
        }
        if (!response.ok) { throw response }
        return response.text().then(function(text) {
            return text ? JSON.parse(text) : {}
        })
    })
    .then( json => {
        if(json.code === 403){
            callError(json);
        } else {
            callOk(json)
        }
    }).catch( err => {
        return err.json()
    }).then( json => {
        callError(json)
    });