const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(
    "mongodb+srv://tarun:tarunsai2341@cluster0.tbd0fbb.mongodb.net/cse?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const listSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  promoted: Boolean,
});

const List = mongoose.model("List", listSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-new", (req, res) => {
  const { id, name, role, promoted } = req.body;
  if (!id || !name || !role || promoted === undefined) {
    return res.status(400).json({ message: "Bad request: missing parameters" });
  }

  const newList = new List(req.body);

  List.findOne({ id: id })
    .then((usr) => {
      if (usr) {
        return res.status(409).json({ message: "Item already exists" });
      } else {
        newList
          .save()
          .then(() => {
            return res.status(201).json({ message: "Item added" });
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/get-all", (req,res) => {
    List.find({}).then(items => res.status(200).json({list: items})).catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    })
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
