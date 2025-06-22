import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import {
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import dbConnect from '@/lib/config/db.config';

export class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class CrudService<
  TDoc extends DocumentType<any>,
  TLean = Omit<TDoc, keyof DocumentType<any>>
> {
  protected populate?: string | string[];

  constructor(
    protected model: ReturnModelType<any>,
    options?: { populate?: string | string[] }
  ) {
    this.populate = options?.populate;
    dbConnect().then(r => {});
  }

  async create(data: Partial<TLean>): Promise<TLean> {
    if (!data || Object.keys(data).length === 0)
      throw new BadRequestError('Data is required');
    const doc = await this.model.create(data);
    return doc.toObject() as TLean;
  }

  async findAll(filter: FilterQuery<TDoc> = {}): Promise<TLean[]> {
    let query = this.model.find(filter).lean();
    if (this.populate) query = query.populate(this.populate);
    return (await query.exec()) as TLean[];
  }

  async findPaginated(
    filter: FilterQuery<TDoc> = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{
    data: TLean[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    const query = this.model.find(filter).lean();
    if (this.populate) query.populate(this.populate);

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data: data as TLean[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(filter: FilterQuery<TDoc>): Promise<TLean | null> {
    if (!filter || Object.keys(filter).length === 0)
      throw new BadRequestError('Filter is required');
    let query = this.model.findOne(filter).lean();
    if (this.populate) query = query.populate(this.populate);
    return (await query.exec()) as TLean | null;
  }

  async findById(id: string): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');
    let query = this.model.findById(id).lean();
    if (this.populate) query = query.populate(this.populate);
    const doc = (await query.exec()) as TLean | null;
    if (!doc) throw new NotFoundError(`Resource with ID ${id} not found`);
    return doc;
  }

  async update(id: string, update: UpdateQuery<TDoc>): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');
    if (!update || Object.keys(update).length === 0)
      throw new BadRequestError('Update data is required');

    let query = this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (this.populate) query = query.populate(this.populate);
    const updatedDoc = (await query.exec()) as TLean | null;
    if (!updatedDoc) throw new NotFoundError(`Resource with ID ${id} not found`);
    return updatedDoc;
  }

  async delete(id: string): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');

    let query = this.model.findByIdAndDelete(id).lean();
    if (this.populate) query = query.populate(this.populate);
    const deletedDoc = (await query.exec()) as TLean | null;
    if (!deletedDoc) throw new NotFoundError(`Resource with ID ${id} not found`);
    return deletedDoc;
  }
}
