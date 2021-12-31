module.exports = class O3Error extends Error {
  constructor(message, code, data) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
  }
};
