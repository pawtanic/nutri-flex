import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import {
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import dbConnect from '@/lib/config/db.config';
import type { ZodSchema } from 'zod';
// Import your MediaService here
import type { MediaService } from './MediaService';

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

export interface CrudServiceOptions {
  populate?: string | string[];
  mediaFields?: string[];
  validator?: ZodSchema<any>;
  softDelete?: boolean;
  mediaService?: MediaService;
  userContext?: { id: string };
  hooks?: {
    beforeCreate?: (data: any) => Promise<void> | void;
    afterCreate?: (doc: any) => Promise<void> | void;
    beforeUpdate?: (id: string, update: any) => Promise<void> | void;
    afterUpdate?: (doc: any) => Promise<void> | void;
    beforeDelete?: (id: string) => Promise<void> | void;
    afterDelete?: (doc: any) => Promise<void> | void;
  };
}

export class CrudService<
  TDoc extends DocumentType<any>,
  TLean = Omit<TDoc, keyof DocumentType<any>>
> {
  protected populate?: string | string[];
  protected mediaFields: string[];
  protected validator?: ZodSchema<any>;
  protected softDelete: boolean;
  protected mediaService?: MediaService;
  protected userContext?: { id: string };
  protected hooks?: CrudServiceOptions['hooks'];

  constructor(
    protected model: ReturnModelType<any>,
    options: CrudServiceOptions = {}
  ) {
    this.populate = options.populate;
    this.mediaFields = options.mediaFields || this.detectMediaFields();
    this.validator = options.validator;
    this.softDelete = options.softDelete ?? false;
    this.mediaService = options.mediaService;
    this.userContext = options.userContext;
    this.hooks = options.hooks;
    dbConnect().then(r => {});
  }

  // Static factory for easy instantiation
  static forModel<M extends ReturnModelType<any>, L = any>(
    model: M,
    options?: CrudServiceOptions
  ) {
    return new CrudService<DocumentType<any>, L>(model, options);
  }

  // Detect media fields by convention
  private detectMediaFields(): string[] {
    return Object.keys(this.model.schema.paths).filter(
      key => key === 'media' || key === 'mediaRefs'
    );
  }

  // Validation
  protected validateInput(data: any) {
    if (this.validator) {
      const result = this.validator.safeParse(data);
      if (!result.success) {
        throw new BadRequestError(JSON.stringify(result.error.format()));
      }
    }
  }

  // Optional: Hook for media processing on create
  protected async processMediaOnCreate(data: Partial<TLean>) {
    if (this.mediaService && this.mediaFields.length > 0) {
      // Example: validate media refs, upload files, etc.
      // You can extend this logic as needed
    }
  }

  // Optional: Hook for media processing on update
  protected async processMediaOnUpdate(data: Partial<TLean>, update: UpdateQuery<TDoc>) {
    if (this.mediaService && this.mediaFields.length > 0) {
      // Example: update media refs, cleanup old media, etc.
    }
  }

  // Optional: Hook for media cleanup on delete
  protected async cleanupMediaOnDelete(doc: TLean) {
    if (this.mediaService && this.mediaFields.length > 0) {
      // Example: delete associated media
    }
  }

  // Custom lifecycle hooks
  protected async runHook(name: keyof NonNullable<CrudServiceOptions['hooks']>, ...args: any[]) {
    if (this.hooks && typeof this.hooks[name] === 'function') {
      await (this.hooks[name] as (...args: any[]) => Promise<void> | void)(...args);
    }
  }

  async create(data: Partial<TLean>): Promise<TLean> {
    if (!data || Object.keys(data).length === 0)
      throw new BadRequestError('Data is required');
    this.validateInput(data);
    await this.runHook('beforeCreate', data);
    await this.processMediaOnCreate(data);
    // Audit trail
    if (this.userContext?.id) {
      (data as any).createdBy = this.userContext.id;
    }
    const doc = await this.model.create(data);
    await this.runHook('afterCreate', doc);
    return doc.toObject() as TLean;
  }

  async findAll(filter: FilterQuery<TDoc> = {}): Promise<TLean[]> {
    let query = this.model.find(this.softDelete ? { ...filter, deleted: { $ne: true } } : filter).lean();
    if (this.populate) query = query.populate(this.populate);
    else query = this.autoPopulate(query);
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

    const query = this.model.find(this.softDelete ? { ...filter, deleted: { $ne: true } } : filter).lean();
    if (this.populate) query.populate(this.populate);
    else this.autoPopulate(query);

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.model.countDocuments(this.softDelete ? { ...filter, deleted: { $ne: true } } : filter),
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
    let query = this.model.findOne(this.softDelete ? { ...filter, deleted: { $ne: true } } : filter).lean();
    if (this.populate) query = query.populate(this.populate);
    else query = this.autoPopulate(query);
    return (await query.exec()) as TLean | null;
  }

  async findById(id: string): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');
    let query = this.model.findById(id).lean();
    if (this.populate) query = query.populate(this.populate);
    else query = this.autoPopulate(query);
    const doc = (await query.exec()) as TLean | null;
    if (!doc) throw new NotFoundError(`Resource with ID ${id} not found`);
    return doc;
  }

  async update(id: string, update: UpdateQuery<TDoc>): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');
    if (!update || Object.keys(update).length === 0)
      throw new BadRequestError('Update data is required');
    this.validateInput(update);
    await this.runHook('beforeUpdate', id, update);
    await this.processMediaOnUpdate({}, update);
    // Audit trail
    if (this.userContext?.id) {
      (update as any).updatedBy = this.userContext.id;
    }
    let query = this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (this.populate) query = query.populate(this.populate);
    else query = this.autoPopulate(query);
    const updatedDoc = (await query.exec()) as TLean | null;
    await this.runHook('afterUpdate', updatedDoc);
    if (!updatedDoc) throw new NotFoundError(`Resource with ID ${id} not found`);
    return updatedDoc;
  }

  async delete(id: string): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id))
      throw new BadRequestError('Invalid ID');
    await this.runHook('beforeDelete', id);
    if (this.softDelete) {
      const deletedDoc = await this.update(id, { deleted: true } as any);
      await this.runHook('afterDelete', deletedDoc);
      return deletedDoc;
    }
    let query = this.model.findByIdAndDelete(id).lean();
    if (this.populate) query = query.populate(this.populate);
    else query = this.autoPopulate(query);
    const deletedDoc = (await query.exec()) as TLean | null;
    if (!deletedDoc) throw new NotFoundError(`Resource with ID ${id} not found`);
    await this.cleanupMediaOnDelete(deletedDoc);
    await this.runHook('afterDelete', deletedDoc);
    return deletedDoc;
  }

  // Bulk operations
  async bulkCreate(dataArray: Partial<TLean>[]): Promise<TLean[]> {
    return Promise.all(dataArray.map(data => this.create(data)));
  }

  async bulkUpdate(updates: { id: string; update: UpdateQuery<TDoc> }[]): Promise<TLean[]> {
    return Promise.all(updates.map(({ id, update }) => this.update(id, update)));
  }

  async bulkDelete(ids: string[]): Promise<TLean[]> {
    return Promise.all(ids.map(id => this.delete(id)));
  }

  // Auto-populate fields ending with Ref/Refs if populate is not set
  private autoPopulate(query: any) {
    if (!this.populate && this.mediaFields.length > 0) {
      this.mediaFields.forEach(field => {
        query.populate(field);
      });
    }
    // Populate any field ending with Ref/Refs
    Object.keys(this.model.schema.paths).forEach(key => {
      if (key.endsWith('Ref') || key.endsWith('Refs')) {
        query.populate(key);
      }
    });
    return query;
  }
}
