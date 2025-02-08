import IUserRepository from "../../domain/interfaces/IUserRepository.js";
import UserModel from "../database/models/UserModel.js";

class UserRepository extends IUserRepository {
  async create(user) {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
  async create(user) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  async createByEmail(email) {
    let user = await UserModel.findOne({ email });

    if (user) {
      return user;
    } else {
      user = await UserModel.create({ email });
      return user;
    }
  }

  async getAll(page, limit,search) {
    const skip = (page - 1) * limit;
    const data =  await UserModel.aggregate([
      {
        $match: {
          isAdmin: false,
          ...(search && { email: { $regex: search, $options: 'i' } }),
        },
      },
      {
        $lookup: {
          from: "sessions",
          localField: "email",
          foreignField: "userEmail",
          as: "userSessions",
        },
      },
      {
        $project: {
          email: 1,
          profilesCount: { $size: "$profiles" },
          isBlock: 1,
          sessionsCount: { $size: "$userSessions" },
        },
      },
      { $skip: skip },
      {
        $limit: 5,
      },
    ]);
    const totalItems = await UserModel.countDocuments();
    return{
      data,
      totalPages: Math.ceil(totalItems / limit),
    }
  }

  async updateById(id, updateData) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default UserRepository;
