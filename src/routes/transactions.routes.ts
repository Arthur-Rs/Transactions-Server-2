import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import upload from '../config/multer.config';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find();
  const balance = await repository.getBalance();
  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const service = new CreateTransactionService();
  const transaction = await service.execute(request.body);
  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const service = new DeleteTransactionService();
  const { id } = request.params;
  await service.execute({ id });
  response.json({ message: 'Transaction was deleted!' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const file = request.file.filename;
    const service = new ImportTransactionsService();
    const transactions = await service.execute({ file });
    response.json(transactions);
  },
);

export default transactionsRouter;
