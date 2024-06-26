const bcrypt = require('bcryptjs');
const User = require('../schemas/users');
const Role = require('../schemas/roles');
const { createRefreshJWTToken, createAccessJWTToken } = require("../utils/jwtUtil");

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Check if the username is already taken
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'Email already taken' })
    }

    // Create new user
    user = new User({ email, name, password })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    user.roleIds = await findRoleByName(['ADMIN', 'USER'])

    // Save user to database
    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
};

const findRoleByName = async (names) => {
  return Role.find({ 'name': { $in: names } })
}

// Login user
const login = async (req, res) => {
  const { email, password } = req.query

  try {
    // Check if user exists
    let user = await User.findOne({ email }).populate('roleIds')
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    const roleNames = user.roleIds.map(role => role.name)

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        roles: roleNames
      }
    }

    res.json({
      accessToken: await createAccessJWTToken(user, payload, req.originalUrl),
      refreshToken: await createRefreshJWTToken(user, payload, req.originalUrl),
      roles: roleNames
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
};

// TODO refresh JWT token
const refresh = async (req, res) => {

}

const getUser = (req, res) => {
  let userId = req.params.id
  User.findById(userId).populate('roleIds').then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

module.exports = {
  register,
  login,
  refresh,
  getUser
};