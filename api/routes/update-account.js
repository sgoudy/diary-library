const newRoute = function( Router, DB, Multipart ){

    // Update a users existing collection.
    Router.route('/account/update').put( Multipart.any(), (req, res) => {
        
        //Get data from body
        const body = req.body;
        const userid = body.userid;
        let name = body.name;
        let email = body.email;
        const password = body.password;
        
        const User = DB.schemas.User;

        // Return if user ID is missing.
        if ( !userid || !password ) {
            res.status(400).send({
                message: 'Missing user id or password.'
            });
            return;
        }

        // Return if there is nothing to change.
        if ( !name && !email ) {
            res.status(204).send();
            return;
        }

        // Check if this user exists first.
        User.findOne({ _id: userid }, async (error, doc) => {
    
            // Returns false if user was not found.
            if (error){
                res.status(404).send();
                return;
            }

            // Did the user even change anything?
            if ( name == doc.name && email == doc.email ) {
                res.status(204).send();
                return;
            } else if ( name == doc.name ) {
                name = '';
            } else if ( email == doc.email ) {
                email = '';
            }
            
            // Make sure the users password matches first.
            if (await doc.isPasswordMatch(password)) {
                // If an email was provided we have to check that it is not already taken.
                if ( email && email.length > 1 ) {
                    User.findOne( { email: email }, doesEmailAlreadyExists );
                } else {
                    runTheUpdate();
                }
            } else {
                res.status(400).send({
                    message: 'Password issue.'
                });
            }
        });


        function doesEmailAlreadyExists(error, user) {
            if(user || error) {
                // Email already taken or a database error occurred! Bail on update.
                res.status(400).send();
                return;
            }

            runTheUpdate();
        }

        function runTheUpdate() {
            // Creating a update object.
            const update = {};
            
            // Add data to the update object if it exists otherwise ignore it.
            if ( email && email.length > 1 ) {
                update.email = email;
            }
            if ( name && name.length > 1 ) {
                update.name = name;
            }

            // Update the user.
            User.findOneAndUpdate(
                { _id: userid }, update,
                { 
                    new: true,
                    upsert: true
                },
                (error, user) => {
                    if (error) {
                        res.status(502).send();
                        return;
                    }
                    // Successfully updated users information.
                    res.status(200).json();
            });

        }

    });
}

export default newRoute;