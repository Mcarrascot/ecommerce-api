const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

//signup
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }

})

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
       req.user.tokens =  req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get("/users/verify", auth, async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id).select('-password')
        res.json({ user })

    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error",
            error
        })
    }
})

router.post("/users/session", async (req, res) => {
    const { email, password } = req.body

    try {
        let foundUser = await Usuario.findOne({ email })

        if (!foundUser) {
            return res.status(400).json({ msg: "El usuario no existe" })
        }

        const passCorrecto = await bcryptjs.compare(password, foundUser.password)

        if (!passCorrecto) {
            return await res.status(400).json({ msg: "Password incorrecto" })
        }

        const payload = {
            user: {
                id: foundUser.id
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600000
            },
            (error, token) => {
                if (error) throw error;

                res.json({ token })
            })

    } catch (error) {
        res.json({
            msg: "Hubo un error",
            error
        })
    }

})

module.exports = router