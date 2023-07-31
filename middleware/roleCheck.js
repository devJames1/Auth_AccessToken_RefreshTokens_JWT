
//middleware to check roles 
const roleCheck = (routesRoles) => {
    return (req, res, next) => {
        // roles from the users database info 
        let userRoles = req.user.roles;
        let status = "";

        // check  if any role in routesRoles can be found in users database info 
        for (let i = 0; i < userRoles.length; i++) {
            if (routesRoles.includes(userRoles[i])) {
                status = "found";
                next();
            } else {
                continue;
            }
        }

        if (status == "") {
            // console.log("not found in routes array");
            res.status(403).json({ error: true, message: "You are not authorized" });
        } else {
            status = "";
        }
    }
}

export default roleCheck;