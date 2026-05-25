import { User } from "@/models/users"

export const userRepository = {
  findById(id: string) {
    return User.findById(id).lean()
  },

  findByAuth0Id(auth0Id: string) {
    return User.findOne({ auth0Id }).lean()
  },

  upsertByAuth0Id(data: {
    auth0Id: string
    email: string
    name: string
    profileImage?: string
  }) {
    return User.findOneAndUpdate(
      { auth0Id: data.auth0Id },
      {
        $set: {
          email: data.email,
          name: data.name,
          ...(data.profileImage !== undefined
            ? { profileImage: data.profileImage }
            : {}),
          lastLoginAt: new Date(),
        },
        $setOnInsert: { description: "" },
      },
      { upsert: true, new: true, runValidators: true }
    ).lean()
  },

  updateById(
    id: string,
    data: Partial<{
      name: string
      profileImage: string
      description: string
    }>
  ) {
    return User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean()
  },
}
