const upload_success = {
    message: "Upload successfull.",
    status: "success"
};
const upload_error = {
    message: "Ups, error occured during last operation, please try it again.",
    status: "danger"
}

const warning_punctuation = {
    message: "Name cannot contain special or punctuation characters!",
    status: "warning"
}
//General SUCCESS and ERROR messages
const general_success = {
    message: "Operation succesfully done.",
    status: "success"
}
const general_error = {
    message: "Ups, error occured during last operation, please try it again.",
    status: "danger"
}

//Functional SUCCESS,WARNING, INFO and ERROR messages
const warning = (warning) => {
    return {
        message: `${warning}`,
        status: "warning"
    }
}

const success = (success) => {
    return {
        message: `${success}`,
        status: "success"
    }
}

const error = (error) => {
    return {
        message: `${error}`,
        status: "danger"
    }
}

const info = (info) => {
    return {
        message: `${info}`,
        status: "primary"
    }
}

module.exports = {
    general_error,
    general_success,
    error,
    success,
    warning,
    info,
    upload_error,
    upload_success,
    warning_punctuation
}

