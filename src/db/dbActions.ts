import { Document, FilterQuery, Model, PopulateOptions, UpdateQuery } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface ReadAllOptions<T> {
  query?: FilterQuery<T>;
  projection?: Record<string, 1 | 0>;
  sort?: Record<string, 1 | -1>;
  filter?: FilterQuery<T>;
  pagination?: PaginationOptions;
  includes?: string[] | PopulateOptions[];
}

interface ReadEveryData<T> {
  sort?: Record<string, 1 | -1>;
}

interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface DbActions<T extends Document> {
  create: (model: Model<T>, data: Partial<T>) => Promise<T>;
  read: (
    model: Model<T>,
    options: {
      query?: FilterQuery<T>;
      includes?: string[] | PopulateOptions[];
    }
  ) => Promise<T | null>;
  readAll: (model: Model<T>, options: ReadAllOptions<T>) => Promise<PaginatedResult<T>>;
  readEvery: (model: Model<T>, options: ReadEveryData<T>) => Promise<T[]>;
  update: (model: Model<T>, options: { query: FilterQuery<T>; update: UpdateQuery<T> }) => Promise<T | null>;
  delete: (model: Model<T>, options: { query: FilterQuery<T> }) => Promise<T | null>;
  deleteMany: (model: Model<T>, query: FilterQuery<T>) => Promise<{ deletedCount?: number }>;
  aggregate: (model: Model<T>, pipeline: any[]) => Promise<any[]>;
}

export const dbActions: DbActions<any> = {
  async create(model, data) {
    return await model.create(data);
  },

  async read(model, { query = {}, includes = [] }) {
    return await model.findOne(query).populate(includes).lean();
  },

  async readAll(model, { query = {}, projection = {}, sort = {}, filter = {}, pagination = {}, includes = [] }) {
    const { page = 1, limit = 10 } = pagination;

    // Combine query and filter for better optimization
    const combinedQuery = { ...query, ...filter };

    // Total document count for pagination
    const totalDocs = await model.countDocuments(combinedQuery).lean().exec();
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    // Query MongoDB
    const docs = await model
      .find(combinedQuery)
      .select(projection)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(includes)
      .exec();

    return {
      docs,
      totalDocs,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage
    };
  },

  async readEvery(model, { sort = {} }: ReadEveryData<any>) {
    return await model.find().sort(sort).exec();
  },

  async update(model, { query, update }) {
    return await model.findOneAndUpdate(query, update, { new: true }).exec();
  },

  async delete(model, { query }) {
    return await model.findOneAndDelete(query).exec();
  },
  async deleteMany(model, query) {
    return await model.deleteMany(query).exec();
  },
  async aggregate(model, pipeline) {
    return await model.aggregate(pipeline).exec();
  }
};
