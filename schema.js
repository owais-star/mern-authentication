const mongoose = require("mongoose");
const schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    created_on: { type: Date, default: Date.now }
});

const user = new schema(
{
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    created_on: { type: Date, default: Date.now }
});

const PostsModel = mongoose.model("posts" , postSchema);
const UsersModel = mongoose.model("Users", user)

module.exports = {PostsModel,UsersModel};