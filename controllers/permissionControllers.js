const mailer        = require("../controllers/mailControl");
const PS                = require("../controllers/signIn");


const render_ask = (req, res) => {
    res.render("ask", {message: ""});
}

const send_permission_mail = (req, res) => {
    mailer.sendPermissionMail(req, res);
    res.render("ask", {message: "Your email has been sent, please wait for Admin response. A Response will be sent to the E-mail you provided below."});
}

const give_permission = (req, res) => {
    if (req.body.access === "true"){
        const credentials = PS.sign_in_randomly(req, res);
        if (credentials){
            mailer.givePermissionMail(credentials);
        }        
    } else {
        mailer.sendWarnMail(req.body.email, "We apologize, but you have been denied access to the Home Assist cloud by Admin");
    }
    res.redirect("back");
}

module.exports = {
    render_ask,
    send_permission_mail,
    give_permission
}