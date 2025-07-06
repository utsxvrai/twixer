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
        const followedUser = await UserService.followUser(req.params.id, req.user.id);
        SuccessResponse.data = followedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);   
    }
}

async function unfollowUser(req, res) {
    try{
        const unfollowedUser = await UserService.unfollowUser(req.params.id, req.user.id);
        SuccessResponse.data = unfollowedUser;
        return res.status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);   
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
    unfollowUser
};