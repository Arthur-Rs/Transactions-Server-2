/* eslint-disable no-shadow */
import csv from 'csv-parse';
import fs from 'fs';
import { resolve } from 'path';
import AppError from '../errors/AppError';
import CreateTransactionsService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  file: string;
}

interface Itransactions {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    const filepath = resolve(__dirname, '..', '..', 'tmp', file);
    const rows: string[] = [];
    const service = new CreateTransactionsService();

    const readStream = fs.createReadStream(filepath);
    const parseStream = csv({ from_line: 2, trim: true });
    const parseCsv = readStream.pipe(parseStream);

    parseCsv.on('error', () => {
      throw new AppError('Error in file', 400);
    });

    parseCsv.on('data', row => {
      rows.push(row);
    });

    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    const transactions: Itransactions[] = rows.map(item => ({
      title: item[0],
      type: (item[1] as unknown) as 'income' | 'outcome',
      value: Number(item[2]),
      category: item[3],
    }));

    const databasePromises: Promise<Transaction>[] = transactions
      .sort(tranA => (tranA.type === 'income' ? 1 : -1))
      .map(async transaction => {
        const data = await service.execute(transaction);
        return data;
      });

    const transactionsEntities: Transaction[] = await Promise.all(
      databasePromises,
    );

    return transactionsEntities;
  }
}

export default ImportTransactionsService;
