const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');


async function createUser(req, res) {
    try {
        const user = await UserService.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture || null,
            bio: req.body.bio || '',
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        console.log("eroor in controller", error);
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function signin(req, res) {
    try {
        const {user, token} = await UserService.signin({
            email: req.body.email,
            password: req.body.password,
        });
        SuccessResponse.data = {user, token};
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        console.log("error in signin controller", error);
        
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getUser(req, res) {
    try {
        const user = await UserService.getUser(req.params.id);
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await UserService.getAll();
        SuccessResponse.data = users;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateUser(req, res) {
    try {
        const updatedUser = await UserService.update({
            id: req.params.id,
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture || null,
            bio: req.body.bio || '',
        });
        SuccessResponse.data = updatedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function deleteUser(req, res) {
    try {
        const deletedUser = await UserService.destroy(req.params.id);
        SuccessResponse.data = deletedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function followUser(req, res) {
    try{
        
        const followedUser = await UserService.followUser(req.user.id, req.params.id);
        console.log('[FOLLOW] UserService.followUser success:', followedUser);
        // Save notification in DB for followed user
        const User = require('../models/user');
        const notifResult = await User.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              notifications: {
                type: 'follow',
                fromUser: req.user.id,
                tweet: null,
                message: `${req.user.name} (@${req.user.username}) followed you!`,
                createdAt: new Date()
              }
            }
          }
        );
        console.log('[FOLLOW] Notification DB update result:', notifResult);
        // Removed emitToUser call; handled by Redis Pub/Sub and Socket.IO
        SuccessResponse.data = followedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch(error){
        console.error('[FOLLOW] Error:', error);
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);   
    }
}

async function unfollowUser(req, res) {
    try{
        // FIX: swap arguments so current user is first, target user is second
        const unfollowedUser = await UserService.unfollowUser(req.user.id, req.params.id);
        SuccessResponse.data = unfollowedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);   
    }
}

async function searchUsers(req, res) {
    try {
        const { q } = req.query;
        const users = await UserService.searchUsers(q);
        SuccessResponse.data = users;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getNotifications(req, res) {
    try {
        const User = require('../models/user');
        const user = await User.findById(req.user.id)
            .populate('notifications.fromUser', 'name username profilePicture')
            .populate('notifications.tweet', 'content');
        SuccessResponse.data = user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getUserProfile(req, res) {
    try {
        const User = require('../models/user');
        const user = await User.findById(req.params.id).select('name username bio profilePicture followers following');
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        // Check if current user is following this user
        let isFollowing = false;
        if (req.user && req.user.id) {
            isFollowing = user.followers.map(id => id.toString()).includes(req.user.id.toString());
        }
        return res.status(StatusCodes.OK).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            isFollowing
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

module.exports = {
    createUser,
    signin,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser,
    searchUsers,
    getNotifications,
    getUserProfile,
};