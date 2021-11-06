const express = require('express')
const PORT = process.env.PORT || 5000
const SECRET = process.env.SECRET || "ujytuytghgihsduffdsiuyiuui7832687hfkdj8"
const app = express()
const path = require('path')
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
var cors = require('cors')
const { PostsModel, UsersModel } = require("./schema");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')



mongoose.connect("mongodb+srv://owais:dev@userdata.588jr.mongodb.net/dev", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5001"],
    credentials: true
}))

app.use('/', express.static(path.join(__dirname, '/web/build')))
app.get("/**", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
})





app.post('/api/v1/login', (req, res) => {
    try {
        if (!req.body.email ||
            !req.body.password
        ) {
            console.log("required field missing");
            res.status(403).send("required field missing");
            return;
        } else {

            UsersModel.findOne({ email: req.body.email }, async (err, user) => {
                if (user) {
                    const match = await bcrypt.compare(req.body.password, user.password)
                    if (match) {
                        const fullName = user.firstName + " " + user.lastName
                        var token = jwt.sign(
                            {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                _id: user._id,
                            }, SECRET);

                        res.cookie("token", token, {
                            httpOnly: true,
                            // expires: (new Date().getTime + 300000), //5 minutes
                            maxAge: 300000
                        });
                        res.status(200).send({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            _id: user._id,
                        })
                    } else {
                        res.send(`Entered password is incorrect`)
                    }
                } else {
                    res.send(`No user is found with this email`)
                }


            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

});


app.post('/api/v1/registration', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        }
        UsersModel.findOne({ email: newUser.email }, (error, user) => {
            if (user) {
                return res.send(`User already registered.`);
            } else if (error) {
                return res.status(400).send(`${error.message}`);

            } else {
                UsersModel.create(newUser, (error, data) => {
                    if (error) {
                        throw error;
                    } else {
                        console.log(data)
                        res.send("Created your account succesfully")
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

//middle ware to check user authentication 
app.use((req, res, next) => {

    jwt.verify(req.cookies.token, SECRET, (err, decoded) => {
        req.body._decoded = decoded;
        console.log("decoded: ", decoded) // bar
        if (!err) {
            next()
        } else {
            res.status(401).send("Access Unauthorized")
        }
    })

})

app.get('/api/v1/profile', (req, res) => {
    UsersModel.findOne({ email: req.body._decoded.email }, (err, user) => {

        if (err) {
            res.status(500).send("error in getting database")
        } else {
            if (user) {
                res.send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    _id: user._id,
                });
            } else {
                res.send("user not found");
            }
        }
    })
})


app.post('/api/v1/logout', (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        maxAge: 300000
    });
    res.send();
})


app.post("/create", (request, response) => {
    try {
        const body = request.body
        PostsModel.create(body, (error, data) => {
            if (error) {
                throw error;
            } else {
                console.log(data)
                response.send("Created post succesfully")
            }
        });
    } catch (error) {
        response.send(`got an error`, error.message);
    }
});

app.get("/posts", (req, res) => {
    try {
        const { title } = req.headers;
        const query = {};
        if (title) {
            query.title = title;
        }
        PostsModel.find(query, (error, data) => {
            if (error) {
                throw error;
            } else {
                res.send(JSON.stringify(data));
            }
        });

    } catch (error) {
        res.send(`got an error during get post ${error.message}`);
    }
});

app.get("/**", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
    // res.redirect("/")
})

mongoose.connection.on("connected", () => console.log("Database Connected..."))
mongoose.connection.on("error", (error) => console.log(`Error${error.message}`))

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})