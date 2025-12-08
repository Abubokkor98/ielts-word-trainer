import { Topic } from './topics.model';

export class TopicsService {
  static async create(data: any) {
    return Topic.create(data);
  }

  static async findAll() {
    return Topic.find().sort({ name: 1 });
  }

  static async findById(id: string) {
    return Topic.findById(id);
  }

  static async update(id: string, data: any) {
    return Topic.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return Topic.findByIdAndDelete(id);
  }
}
