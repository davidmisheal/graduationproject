const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const Place = require('./../models/placeModel');

exports.getUserFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Ensure req.user is properly populated by previous middleware
  console.log('Fetching favorites for user:', userId);

  const user = await User.findById(userId).populate({
    path: 'favorites',
    select: 'name description' // Adjust according to your Place model's attributes
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (!user.favorites || user.favorites.length === 0) {
    console.log('No favorites found for this user.');
  } else {
    console.log('Found favorites:', user.favorites);
  }

  res.status(200).json({
    status: 'success',
    data: {
      favorites: user.favorites
    }
  });
});
// Add a place to user's favorites
exports.addUserFavorite = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { placeId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (!user.favorites.includes(placeId)) {
    user.favorites.push(placeId);
    await user.save();
  }

  const place = await Place.findById(placeId);
  if (!place) {
    return next(new AppError('Place not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      place
    }
  });
});

exports.removeFavorite = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { placeId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  user.favorites = user.favorites.filter(id => id.toString() !== placeId);
  await user.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  req.body.photo = req.file.filename;
  next();
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  let photoBase64 = '';
  if (user.photo) {
    photoBase64 = Buffer.from(user.photo).toString('base64');
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        ...user.toObject(),
        photo: photoBase64
      }
    }
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  getUser(req, res, next);
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { userId, passwordCurrent, newPassword, passwordConfirm } = req.body;

  // Validate the presence of all required fields
  if (!userId || !passwordCurrent || !newPassword || !passwordConfirm) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if new passwords match
  if (newPassword !== passwordConfirm) {
    return res.status(400).json({ message: 'New passwords do not match.' });
  }

  // Find the user by ID
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Check if the current password is correct
  const isMatch = await bcrypt.compare(passwordCurrent, user.password);
  if (!isMatch) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // Update the password
  user.password = newPassword;
  await user.save(); // This triggers the pre-save middleware to hash the password

  // Normally here you would create and send token, but since we're simplifying:
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully.',
    data: {
      userId: user._id,
      email: user.email
    }
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
