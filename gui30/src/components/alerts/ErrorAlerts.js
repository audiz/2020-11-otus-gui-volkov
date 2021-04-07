import React from 'react';

function ErrorAlerts(props) {
    return props.errorMsg ?
            <div className="alert alert-danger" role="alert">
                Error code: {props.errorMsg.code}, message: {props.errorMsg.message}
            </div> : null
}
export default ErrorAlerts;