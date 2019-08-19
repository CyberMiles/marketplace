module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    cate_watch: {
      entry: 'src/categories.js',
      template: 'public/categories/watch.html',
      filename: 'categories/watch.html'
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/"
};
