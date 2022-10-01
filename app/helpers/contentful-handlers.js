const handleBlogItem = (item) => {
  return { ...item.fields, hero: item.fields?.hero?.fields, id: item.sys.id };
};

const handleBlogList = (data) => {
  return data.items.map(handleBlogItem);
};

module.exports = {
  handleBlogItem,
  handleBlogList,
};
