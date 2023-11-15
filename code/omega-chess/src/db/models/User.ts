import moongose from "mongoose"

const UserSchema = new moongose.Schema({
  email: String,
  name: String,
  picture: String,
})

export default moongose.models.User || moongose.model("User", UserSchema)