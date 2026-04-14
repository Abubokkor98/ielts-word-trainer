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
      .sort({ updatedAt: -1 });
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
    const list = await WordList.findOneAndUpdate(
      { _id: listId, user: userId },
      { name },
      { new: true },
    );

    if (!list) {
      throw new AppError('List not found', 404);
    }

    return list;
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
    // Remove from any other list first (one word = one list)
    await WordList.updateMany(
      { user: userId, _id: { $ne: listId }, words: wordId },
      { $pull: { words: wordId } },
    );

    const list = await WordList.findOneAndUpdate(
      { _id: listId, user: userId },
      { $addToSet: { words: wordId } },
      { new: true },
    ).populate(WORDS_POPULATE);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    return list;
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
