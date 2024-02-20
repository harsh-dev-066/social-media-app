const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

module.exports = {
  generateFileUrl,
};
