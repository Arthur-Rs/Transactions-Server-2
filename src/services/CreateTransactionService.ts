// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';

// => Models
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: Request): Promise<Transaction> {
    const filter = {
      where: { title: category },
    };

    const repositoryTransaction = getCustomRepository(TransactionsRepository);
    const repositoryCategory = getRepository(Category);
    const checkingCategory = await repositoryCategory.findOne(filter);

    const balance = await repositoryTransaction.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError("Your don't have money", 400);
    }

    if (!checkingCategory) {
      const newCategory = repositoryCategory.create({ title: category });
      await repositoryCategory.save(newCategory);
    }

    const CategorySelected = await repositoryCategory.findOne(filter);

    const transaction = repositoryTransaction.create({
      title,
      type,
      value,
      category: CategorySelected,
    });

    await repositoryTransaction.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
