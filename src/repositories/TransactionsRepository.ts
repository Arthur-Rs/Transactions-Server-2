import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const dataIncome = await this.find({ where: { type: 'income' } });
    const dataOutcome = await this.find({ where: { type: 'outcome' } });

    const income = dataIncome
      .map(value => value.value)
      .reduce((total, value) => total + value, 0);

    const outcome = dataOutcome
      .map(value => value.value)
      .reduce((total, value) => total + value, 0);

    const total = income - outcome;

    const Balance: Balance = {
      income,
      outcome,
      total,
    };

    return Balance;
  }
}

export default TransactionsRepository;
