const router = require('express').Router();
const { updateProfileSchema, updateAvatarSchema, getUserByIdSchema } = require('../schemas/users');
const {
  getUsers, getUserById, getUserInfo, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUserByIdSchema, getUserById);
router.patch('/me', updateProfileSchema, updateProfile);
router.patch('/me/avatar', updateAvatarSchema, updateAvatar);

module.exports = router;
