import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const repository = getRepository(Transaction);
    const transaction = await repository.findOne(id);

    if (!transaction) {
      throw new AppError('This transactions not exist in database!', 400);
    }
    await repository.remove(transaction as Transaction);
  }
}

export default DeleteTransactionService;
