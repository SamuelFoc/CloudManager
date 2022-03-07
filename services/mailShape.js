const fullfillMail = (req, res) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ask</title>
        <style>
            body {
                width: 100vw;
                font-family: Sans-Serif;
            }
            hr {
                border: 1px solid rgb(221, 220, 220);
                margin: 5px;
                margin-top: 20px;
            }
            .container {
                margin: 5% 10%;
            }
            .text-dark {
                color: rgb(36, 36, 36);
            }
            .text-light {
                color: whitesmoke;
            }
            .text-muted {
                color: rgb(148, 146, 146);
                font-size: 16px;
            }
            .text-center {
                text-align: center;
            }
            .d-flex {
                display: flex;
            }
            .flex-column {
                display: flex;
                flex-direction: column;
            }
            .align-items-center {
                align-items: center;
            }
            .form-control {
                border: 1px solid rgb(199, 197, 197);
                border-radius: 5px;
            }
            .form-control input {
                font-size: medium;
                padding: 5px;
                margin: 15px;
            } 
            .col-5 {
                width: 41%;
                margin-right: 5px;
            }
            .col-6 {
                width: 50%;
            }
            .w-100 {
                width: 100%;
            }
            .w-50 {
                width: 50%;
            }
            .w-25 {
                width: 25%;
            }
            .justify-content-center {
                justify-content: center;
            }
            .bg-secondary {
                background-color: #6c757d;
            }
            .bg-info {
                background-color: #0dcaf0;
            }
            .rounded {
                border-radius: 5px;
                padding: 2%;
            }
            .btn {
                padding: 10px;
                max-width: 150px;
                border-radius: 5px;
                border: 1px solid green;
                background-color: #198754;
                color: white;
                font-weight: bold;
                transition: .2s;
                font-size: medium;
            }
            .btn-danger {
                padding: 10px;
                max-width: 150px;
                border-radius: 5px;
                border: 1px solid green;
                background-color: #dc3545;
                color: white;
                font-weight: bold;
                transition: .2s;
                font-size: medium;
            }
            .btn:hover {
                box-shadow: green 0px 0px 5px;
                cursor: pointer;
            }
    
        </style>
    </head>
    
    <body>
        <div class="row">
            <h1 class="text-dark">Request for access</h1>
            <div class="mx-2 bg-info p-4 rounded" style="width: 90vw;">
                <strong>Created at: </strong>
                <p>${new Date}</p>
            </div>
            <div class="bg-secondary rounded" style="width: 90vw;">
                <div>
                    <strong class="text-light">E-mail: </strong><p class="text-light">${req.body.email}</p>
                </div>
                <div>
                    <strong class="text-light">Message: </strong><p class="text-light">${req.body.message}</p>
                </div>
            </div>
            </div>
            <hr>
            <div class="row">
                <h4>Admin answer</h4>
                <form class="form-control align-items-center" action="http://aha-cloud.com/ask/givePermission" method="post">
                    <input type="email" name="email" class="form-control w-100" value="${req.body.email}">
                    <button class="btn" type="submit" name="access" value="true">Give access</button>
                    <button class="btn-danger" type="submit" name="access" value="false">Deny access</button>
                    <div>
                        <p class="text-muted text-center" style="font-size: 10px;">By pressing the "Give access" button, you agree that the specified user will use all the services of your HomeAssist cloud storage.</p>
                    </div>
                </form>
            </div>
        </div>
    </body>
    
    </html>`
}

const givePermMail = (email, password) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ask</title>
        <style>
            body {
                width: 100vw;
                font-family: Sans-Serif;
            }
            hr {
                border: 1px solid rgb(221, 220, 220);
                margin: 5px;
                margin-top: 20px;
            }
            .container {
                margin: 5% 10%;
            }
            .text-dark {
                color: rgb(36, 36, 36);
            }
            .text-light {
                color: whitesmoke;
            }
            .text-muted {
                color: rgb(148, 146, 146);
                font-size: 16px;
            }
            .text-center {
                text-align: center;
            }
            .d-flex {
                display: flex;
            }
            .flex-column {
                flex-direction: column;
            }
            .align-items-center {
                align-items: center;
            }
            .form-control {
                border: 1px solid rgb(199, 197, 197);
                border-radius: 5px;
            }
            .form-control input {
                font-size: medium;
                padding: 5px;
                margin: 15px;
            } 
            .col-5 {
                width: 41%;
                margin-right: 5px;
            }
            .col-12 {
                width: 100%;
            }
            .w-50 {
                width: 50%;
            }
            .w-25 {
                width: 25%;
            }
            .justify-content-center {
                justify-content: center;
            }
            .bg-secondary {
                background-color: #6c757d;
            }
            .bg-info {
                background-color: #0dcaf0;
            }
            .rounded {
                border-radius: 5px;
                padding: 2%;
            }
            .btn {
                padding: 10px;
                max-width: 150px;
                border-radius: 5px;
                border: 1px solid green;
                background-color: #198754;
                color: white;
                font-weight: bold;
                transition: .2s;
                font-size: medium;
            }
            .btn:hover {
                box-shadow: green 0px 0px 5px;
                cursor: pointer;
            }
    
        </style>
    </head>
    
    <body>
        <div class="container">
            <h2 class="text-dark">Sign Up credentials</h2>
                <strong>A user account has been created for you. Below are your login credentials.</strong>
                <div class="col-12 bg-secondary p-4 rounded" style="margin-top: 10px;">
                    <div>
                        <strong class="text-light">E-mail: </strong><p class="text-light" style="text-decorations: none;">${email}</p>
                    </div>
                    <div>
                        <strong class="text-light">Password: </strong><p class="text-light">${password}</p>
                    </div>
                </div>
            <hr>
            <div style="width: 100vw; display: flex; align-items: center; margin-top: 10px;">
                <a class="btn" href="http://aha-cloud.com/signUp">Sign up</a>  
            </div>
        </div>
    </body>
    
    </html>`
}

const warnMail = (message) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ask</title>
        <style>
            body {
                width: 100vw;
                font-family: Sans-Serif;
            }
            hr {
                border: 1px solid rgb(221, 220, 220);
                margin: 5px;
                margin-top: 20px;
            }
            .container {
                margin: 5% 10%;
            }
            .bg {
                background-color: #ffc107;
            }
            .text-dark {
                color: rgb(36, 36, 36);
            }
            .text-light {
                color: whitesmoke;
            }
            .text-muted {
                color: rgb(148, 146, 146);
                font-size: 16px;
            }
            .text-center {
                text-align: center;
            }
            .d-flex {
                display: flex;
            }
            .flex-column {
                flex-direction: column;
            }
            .align-items-center {
                align-items: center;
            }
            .form-control {
                border: 1px solid rgb(199, 197, 197);
                border-radius: 5px;
            }
            .form-control input {
                font-size: medium;
                padding: 5px;
                margin: 15px;
            } 
            .col-5 {
                width: 41%;
                margin-right: 5px;
            }
            .col-12 {
                width: 100%;
            }
            .w-50 {
                width: 50%;
            }
            .w-25 {
                width: 25%;
            }
            .justify-content-center {
                justify-content: center;
            }
            .bg-secondary {
                background-color: #6c757d;
            }
            .bg-info {
                background-color: #0dcaf0;
            }
            .rounded {
                border-radius: 5px;
                padding: 2%;
            }
            .btn {
                padding: 10px;
                max-width: 150px;
                border-radius: 5px;
                border: 1px solid green;
                background-color: #198754;
                color: white;
                font-weight: bold;
                transition: .2s;
                font-size: medium;
            }
            .btn:hover {
                box-shadow: green 0px 0px 5px;
                cursor: pointer;
            }
    
        </style>
    </head>
    
    <body>
        <div class="container">
            <h4 class="text-dark">Your admin from HomeAssist</h4>
            <div>
                <div class="col-12 bg p-4 rounded">
                    <div class="row d-flex">
                        <strong>Warning: </strong>
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    
    </html>`
}

module.exports = {
    fullfillMail,
    givePermMail,
    warnMail
}