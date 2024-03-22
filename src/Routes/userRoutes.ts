// import { Router } from 'express'
// import isAuth from '../middlewares/isAuth'
// import { authMiddleware } from '../middlewares/attachCurrentUser'
// import passport from 'passport'
// import { UserController } from 'infra/web/user/controllers/user.controller'

// const routes = Router()

// const userController = new UserController()

// routes.post('/signup', authMiddleware, userController.signUp)
// routes.post('/login', userController.login)
// routes.post('/logout', userController.logout)
// routes.put('/update', isAuth, authMiddleware, userController.updateUser)
// routes.get('/currentUser', isAuth, authMiddleware, userController.getCurrentUser)
// routes.post('/guestUser', userController.guestUser)
// routes.post('/address', authMiddleware, userController.createAddress)

// routes.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// )

// routes.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/login/success',
//     failureRedirect: '/login/failed',
//   })
// )

// routes.get('/login/success', userController.loginGoogleSucces)

// routes.get('/login/failed', (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: 'Login failed',
//   })
// })

// routes.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error(err)
//     }
//     res.redirect(process.env.FRONTEND_URL as string)
//   })
// })
// export default routes
