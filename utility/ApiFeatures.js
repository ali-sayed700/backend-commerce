class ApiFeature {
  constructor(MongooseQuery, queryString) {
    this.mongooseQuery = MongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryStringObj = { ...this.queryString };

    const excudeFields = ["page", "limit", "fields", "sort", "keyword"];
    excudeFields.forEach((field) => delete queryStringObj[field]);

    // Aply filtering using [gt-gte-lt-lte]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-updatedAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const sortBy = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-updatedAt");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocument, modelName) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndx = page * limit;
    // pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPage = Math.ceil(countDocument / limit);

    if (endIndx < countDocument) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }
    if (modelName === "product" || modelName === "subcategory") {
      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    } else {
      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    }
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeature;
