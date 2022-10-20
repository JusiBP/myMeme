function dateFunction(post, currentUser) {
    let dateString = "";
    let dataViews  = 0;
    const postsModified = post.map((post1) => {
        dateString = post1.date.getDate() + "/" + post1.date.getMonth() + "/" + post1.date.getFullYear();
        let newObject = {
          _id: post1._id,
          userId: post1.userInfo._id,
          username: post1.userInfo.username,
          memeUrl: post1.memeUrl,
          category: post1.category,
          description: post1.description,
          date: dateString,
        };
        console.log("hola desde DATEFUNCTION: ", newObject)
        return newObject;
      })
    if (currentUser) {
        const {username, _id, imageUser} = currentUser
        dataViews = {username, _id, imageUser, post: postsModified};
        return dataViews
        }
    else {
        dataViews = {post: postsModified};
        return dataViews
    }
}

module.exports = dateFunction;

