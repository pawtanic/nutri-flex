import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  Types,
} from 'mongoose'

export class CrudService<TDoc extends Document, TLean = Omit<TDoc, keyof Document>> {
  constructor(protected model: Model<TDoc>) {}

  async create(data: Partial<TLean>): Promise<TLean> {
    const doc = await this.model.create(data)
    return doc.toObject() as TLean
  }

  async findAll(filter: FilterQuery<TDoc> = {}): Promise<TLean[]> {
    return await this.model.find(filter).lean().exec() as TLean[]
  }

  async findOne(filter: FilterQuery<TDoc>): Promise<TLean | null> {
    return await this.model.findOne(filter).lean().exec() as TLean | null
  }

  async findById(id: string): Promise<TLean | null> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.model.findById(id).lean().exec() as TLean | null
  }

  async update(id: string, update: UpdateQuery<TDoc>): Promise<TLean | null> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec() as TLean | null
  }

  async delete(id: string): Promise<TLean | null> {
    if (!Types.ObjectId.isValid(id)) return null
    return await this.model.findByIdAndDelete(id).lean().exec() as TLean | null
  }
}
