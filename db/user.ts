import * as SQLite from "expo-sqlite";
import type { User } from "@/types/user";


export const createUser = async (user: User): Promise<User> => {
  console.log('Creating user:', user);

  const db = await SQLite.openDatabaseAsync('flexzone_database');

  const exists = await getUserByGoogleId(user.g_id);
  if (exists) {
    console.log('User already exists:', exists);
    return exists;
  }

  const result = await db.runAsync(
    'INSERT INTO user (g_id, username, email, profile_pic) VALUES (?, ?, ?, ?)',
    [user.g_id, user.username, user.email, user.profile_pic ?? null]
  );

  // Fetch the newly created user
  const createdUser = await db.getFirstAsync<User>(
    'SELECT * FROM user WHERE id = ?',
    [result.lastInsertRowId]
  );

  if (!createdUser) throw new Error('User creation failed');

  console.log('Newly created user:', createdUser);
  return createdUser;
};


export const getUserByGoogleId = async (g_id: string): Promise<User | null> => {
    console.log('Getting user by google id:', g_id)
    const db = await SQLite.openDatabaseAsync('flexzone_database');

    const user = await db.getFirstAsync<User>('SELECT * FROM user WHERE g_id = ?', [g_id]);
    console.log('User: ', user)

    return user ?? null;
}