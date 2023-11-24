import { prisma } from '@/config';
import { ISignUp } from '@/interfaces/auth';
import { UpdateUserData, UsersBasic } from '@/interfaces/users';
import { Prisma, User } from '@prisma/client';

//=================== GET =====================//
function getUserByEmail(email: string) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
    include: {

    },
  };

  return prisma.user.findUnique(params);
}

async function getUserOrAdministratorById(id: number): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {

    },
  });

  delete user['password'];
  return user;
}
async function getAllUsers(): Promise<UsersBasic[]> {
  const users = await prisma.user.findMany({
    where: {
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });

  return users;
}

function getAllAdministrators(): Promise<UsersBasic[]> {
  const params: Prisma.UserFindManyArgs = {
    where: {
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  };
  return prisma.user.findMany(params);
}

function getUsersByFilterName(name: string): Promise<UsersBasic[]> {
  const params: Prisma.UserFindManyArgs = {
    where: {
      name: {
        startsWith: `${name}`,
        mode: 'insensitive',
      },
    },
    skip: 0,
    take: undefined,
  };

  return prisma.user.findMany(params);
}

function getAdministratorsByFilterName(name: string): Promise<UsersBasic[]> {
  return prisma.user.findMany({
    where: {
      name: {
        startsWith: `${name}`,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
    skip: 0,
    take: undefined,
  });
}

//================= INSERT ===================//

async function insertUser(newUser: ISignUp) {
  delete newUser.confirmPassword;
  return await prisma.user.create({ data: newUser });
}

//================= UPDATE ===================//

async function updateUser(id: number, updateUserData: UpdateUserData) {
  console.log(updateUserData);
  const resultUsers = await prisma.user.update({
    where: { id },
    data: updateUserData,
  });

  if (!resultUsers) throw { type: 'error' };
}

async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id: id } });
}

export {
  deleteUser, getAdministratorsByFilterName, getAllAdministrators, getAllUsers, getUserByEmail, getUserOrAdministratorById, getUsersByFilterName, insertUser, updateUser
};

