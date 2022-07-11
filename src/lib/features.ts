export function APIfeatures(query, queryString) {
  this.query = query;
  this.queryString = queryString;

  this.paginating = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  };
  this.sorting = () => {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  };
  this.filtering = () => {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    return this;
  };
  this.searching = () => {
    const search = this.queryString.search;
    if (search) {
      this.query = this.query.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    return this;
  };
}
