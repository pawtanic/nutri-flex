import {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  startSession,
  Types,
  UpdateQuery,
} from 'mongoose'

export class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class CrudService<TDoc extends Document, TLean = Omit<TDoc, keyof Document>> {
  protected populate?: string | string[]

  constructor(protected model: Model<TDoc>, options?: { populate?: string | string[] }) {
    this.populate = options?.populate
  }

  private async withTransaction<R>(
    fn: (session: ClientSession) => Promise<R>,
    externalSession?: ClientSession
  ): Promise<R> {
    if (externalSession) return fn(externalSession)

    const session = await startSession()
    try {
      return await session.withTransaction(() => fn(session))
    } finally {
      await session.endSession()
    }
  }

  async create(data: Partial<TLean>, session?: ClientSession): Promise<TLean> {
    if (!data || Object.keys(data).length === 0) throw new BadRequestError('Data is required')
    return this.withTransaction(async (sess) => {
      const docs = await this.model.create([data], { session: sess })
      return docs[0].toObject() as TLean
    }, session)
  }

  async findAll(filter: FilterQuery<TDoc> = {}, session?: ClientSession): Promise<TLean[]> {
    let query = this.model.find(filter).lean()
    if (this.populate) query = query.populate(this.populate)
    if (session) query = query.session(session)
    return (await query.exec()) as TLean[]
  }

  async findOne(filter: FilterQuery<TDoc>, session?: ClientSession): Promise<TLean | null> {
    if (!filter || Object.keys(filter).length === 0) throw new BadRequestError('Filter is required')
    let query = this.model.findOne(filter).lean()
    if (this.populate) query = query.populate(this.populate)
    if (session) query = query.session(session)
    return (await query.exec()) as TLean | null
  }

  async findById(id: string, session?: ClientSession): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid ID')
    let query = this.model.findById(id).lean()
    if (this.populate) query = query.populate(this.populate)
    if (session) query = query.session(session)
    const doc = (await query.exec()) as TLean | null
    if (!doc) throw new NotFoundError(`Resource with ID ${id} not found`)
    return doc
  }

  async update(
    id: string,
    update: UpdateQuery<TDoc>,
    session?: ClientSession
  ): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid ID')
    if (!update || Object.keys(update).length === 0) throw new BadRequestError('Update data is required')

    return this.withTransaction(async (sess) => {
      let query = this.model.findByIdAndUpdate(id, update, { new: true, session: sess }).lean()
      if (this.populate) query = query.populate(this.populate)
      const updatedDoc = (await query.exec()) as TLean | null
      if (!updatedDoc) throw new NotFoundError(`Resource with ID ${id} not found`)
      return updatedDoc
    }, session)
  }

  async delete(id: string, session?: ClientSession): Promise<TLean> {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid ID')

    return this.withTransaction(async (sess) => {
      let query = this.model.findByIdAndDelete(id, { session: sess }).lean()
      if (this.populate) query = query.populate(this.populate)
      const deletedDoc = (await query.exec()) as TLean | null
      if (!deletedDoc) throw new NotFoundError(`Resource with ID ${id} not found`)
      return deletedDoc
    }, session)
  }
}
