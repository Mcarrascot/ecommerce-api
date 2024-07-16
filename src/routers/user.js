import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = new express.Router()

const generateToken = (userId, secret = 'MY_SECRET_KEY', expiresIn = 360000) => {
    return new Promise((resolve, reject) => {
      jwt.sign({ user: { id: userId } }, secret, { expiresIn }, (error, token) => {
        if (error) reject(error)
        resolve(token)
      })
    })
  }

const sendErrorResponse = (res, status, msg) => {
    res.status(status).json({ msg })
  }

//signup
router.post('/users/create', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = await generateToken(user._id, 'MY_SECRET_KEY')
        res.json({ token })
    } catch (error) {
        sendErrorResponse(res, 400, error)
    }
})

//login
router.post('/users/login', async (req, res) => {
    const { email, password } = req.body

    try {
        let foundUser = await User.findOne({ email })
        if (!foundUser) return sendErrorResponse(res, 400, "El User no existe")

        const isPasswordCorrect = await bcryptjs.compare(password, foundUser.password)
        if (!isPasswordCorrect) return sendErrorResponse(res, 400, "El User no existe")

        const token = await generateToken(foundUser.id, process.env.SECRET, 3600000)
        res.json({ token })
    } catch (error) {
        sendErrorResponse(res, 500, "Hubo un error")
    }
})

//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get("/users/verify", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({ user })
    } catch (error) {
        sendErrorResponse(res, 500, "Hubo un error")
    }
})

router.put("/users/update", auth, async (req, res) => {
    const newDataForOurUser = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, newDataForOurUser, { new: true }).select("-password")
        res.json(updatedUser)
    } catch (error) {
        sendErrorResponse(res, 500, error)
    }
})

export default router;