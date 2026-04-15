import { AppError } from '../../core/errors/AppError';
import { WordList } from './word-list.model';

const WORDS_POPULATE = {
  path: 'words',
  populate: { path: 'topics', select: 'name' },
};

export class WordListService {
  static async getUserLists(userId: string) {
    return WordList.find({ user: userId })
      .populate(WORDS_POPULATE)
      .sort({ createdAt: 1 });
  }

  static async createList(userId: string, name: string) {
    try {
      return await WordList.create({ user: userId, name, words: [] });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new AppError(
          `A list named "${name}" already exists`,
          409,
        );
      }
      throw error;
    }
  }

  static async renameList(userId: string, listId: string, name: string) {
    try {
      const list = await WordList.findOneAndUpdate(
        { _id: listId, user: userId },
        { name },
        { new: true, runValidators: true, context: 'query' },
      );

      if (!list) {
        throw new AppError('List not found', 404);
      }

      return list;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new AppError(`A list named "${name}" already exists`, 409);
      }
      throw error;
    }
  }

  static async deleteList(userId: string, listId: string) {
    const list = await WordList.findOneAndDelete({
      _id: listId,
      user: userId,
    });

    if (!list) {
      throw new AppError('List not found', 404);
    }

    return list;
  }

  static async addWord(userId: string, listId: string, wordId: string) {
    const session = await WordList.startSession();

    try {
      let updatedList: Awaited<ReturnType<typeof WordList.findOneAndUpdate>> | null = null;

      await session.withTransaction(async () => {
        // Verify target list exists before modifying anything
        const targetExists = await WordList.findOne({
          _id: listId,
          user: userId,
        }).session(session);

        if (!targetExists) {
          throw new AppError('List not found', 404);
        }

        // Remove from any other list (one word = one list)
        await WordList.updateMany(
          { user: userId, _id: { $ne: listId }, words: wordId },
          { $pull: { words: wordId } },
          { session },
        );

        // Add to target list
        updatedList = await WordList.findOneAndUpdate(
          { _id: listId, user: userId },
          { $addToSet: { words: wordId } },
          { new: true, session },
        ).populate(WORDS_POPULATE);
      });

      if (!updatedList) {
        throw new AppError('List not found', 404);
      }

      return updatedList;
    } finally {
      await session.endSession();
    }
  }

  static async removeWord(userId: string, listId: string, wordId: string) {
    const list = await WordList.findOneAndUpdate(
      { _id: listId, user: userId },
      { $pull: { words: wordId } },
      { new: true },
    ).populate(WORDS_POPULATE);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    return list;
  }
}
