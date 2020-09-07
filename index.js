
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 4000

const { users } = require('./state')
let counter = users.length;


/* BEGIN - create routes here */

//MIDDLEWARE
app.use(express.json())
app.use(bodyParser.json())

//GET ALL USERS
app.get('/users', (req, res) => res.json(users));

//GET SPECIFIC USERS
app.get('/users/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));

  if(userFound) {
    res.json(users.filter(user => user._id === parseInt(req.params.userId)));
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});

//CREATE A NEW USER
app.post('/users', (req, res) => {
counter++

const newUser = {
  _id: counter,
  name: req.body.name,
  occupation: req.body.occupation,
  avatar: req.body.avatar,
}
if(!newUser.name || !newUser.avatar || !newUser.occupation) {
  return res.status(400).json({Error: "Invalid input format."});
}
users.push(newUser);
res.json(users);
});

//UPDATE USER INFO
app.put('/users/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));
  
  if(userFound) {
    const updatedUser = req.body;
    users.forEach(user => {
      if(user._id === parseInt(req.params.userId)) {
        user.name = updatedUser.name ? updatedUser.name : user.name;
        user.occupation = updatedUser.occupation ? updatedUser.occupation : user.occupation;
        user.avatar = updatedUser.avatar ? updatedUser.avatar : user.avatar;

        res.json({ msg: 'User updated',user})
      }
    })
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});

//DELETE USER
app.delete('/user/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));

  if(userFound) {
    users.forEach(user => {
      if(user._id === parseInt(req.params.userId)) {
        user.isActive = false;
      }
    })
    res.send({
      msg: 'User has been deleted',
      users: users.filter(user => user._id === parseInt(req.params.userId))
    });
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});

/* END - create routes here */

app.listen(port, () => console.log(`Example app listening on port ${port}!`));