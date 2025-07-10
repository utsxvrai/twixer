const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('../utils/common/auth');
const { publisher } = require('../config/redis-config');

const userRepository = new UserRepository();

async function create(data){
    try {
        const existingUserByUsername = await userRepository.getUserByUsername(data.username);
        if (existingUserByUsername) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Username already exists');
        }

        const existingUserByEmail = await userRepository.getUserByEmail(data.email);
        if (existingUserByEmail) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exists');
        }

        data.password = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        throw error;
    }
}

async function signin(data){
    try{
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
        }

        const token = createToken({id : user._id, username: user.username, email: user.email});
        return { user, token };
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);

    }
}

async function getUser(id) {
    try {
        const user = await userRepository.get(id);
        return user;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getAll() {
    try {
        const users = await userRepository.getAll();
        return users;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function update(id, data) {
    try {
        const updatedUser = await userRepository.update(id, data);
        return updatedUser;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function destroy(id) {
    try {
        const deletedUser = await userRepository.destroy(id);
        return deletedUser;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function isAuthenticated(token) {
    try {
        const decoded = verifyToken(token);
        const user = await userRepository.get(decoded.id);
        return user;
    } catch (error) {
        throw new AppError('Authentication failed', StatusCodes.UNAUTHORIZED);
    }
}

async function followUser(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) {
        throw new AppError(400, 'You cannot follow yourself');
    }

    const currentUser = await userRepository.get(currentUserId);
    const targetUser = await userRepository.get(targetUserId);

    if (currentUser.following.includes(targetUserId)) {
        throw new AppError(400, 'Already following this user');
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();
    
    await publisher.publish('notifications', JSON.stringify({
      type: 'follow',
      targetUserId,
      payload: {
        followerId: currentUser._id,
        followerName: currentUser.name,
        followerUsername: currentUser.username
      }
    }));
}


async function unfollowUser(currentUserId, targetUserId) {
  const currentUser = await userRepository.get(currentUserId);
  const targetUser = await userRepository.get(targetUserId);

  currentUser.following = currentUser.following.filter(
    id => id.toString() !== targetUserId
  );

  targetUser.followers = targetUser.followers.filter(
    id => id.toString() !== currentUserId
  );

  await currentUser.save();
  await targetUser.save();
}

async function searchUsers(query) {
    if (!query) return [];
    // Search by name or username (case-insensitive)
    return await userRepository.model.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } }
        ]
    }).select('name username profilePicture');
}


module.exports = {
    create,
    signin,
    getUser,
    getAll,
    update,
    destroy,
    isAuthenticated,
    followUser,
    unfollowUser,
    searchUsers
};



