const User = require("../models/User.model");

function dateFunction(post, currentUser) {
  let dateString = "";
  let dataViews = 0;
  let likedPostsTemp = [];
  User.findById(currentUser._id).then((user) => {
    console.log("LIKED POSTS IN DATEFUNC ", user.likedPosts);
    likedPostsTemp = user.likedPosts;
  });

  console.log("LIKED POSTS FUERA ", likedPostsTemp);

  const postsModified = post.map((post1) => {
    dateString =
      post1.date.getDate() +
      "/" +
      post1.date.getMonth() +
      "/" +
      post1.date.getFullYear();
    let newObject = {
      _id: post1._id,
      userId: post1.userInfo._id,
      username: post1.userInfo.username,
      memeUrl: post1.memeUrl,
      category: post1.category,
      description: post1.description,
      date: dateString,
      likes: post1.likes.length,
      likedPosts: likedPostsTemp,
    };
    return newObject;
  });
  if (currentUser) {
    const { username, _id, imageUser } = currentUser;
    dataViews = { username, _id, imageUser, post: postsModified };
    return dataViews;
  } else {
    dataViews = { post: postsModified };
    return dataViews;
  }
}

module.exports = dateFunction;

// async function dateFunction(post, currentUser) {
//   let dateString = "";
//   let dataViews = 0;
//   let likedPostsTemp = [];
//   const userTemp = await User.findById(currentUser._id);
//   console.log("LIKED POSTS IN DATEFUNC ", userTemp.likedPosts);
//   likedPostsTemp = userTemp.likedPosts;

//   console.log("LIKED POSTS FUERA ", likedPostsTemp);

//   const postsModified = post.map((post1) => {
//     dateString =
//       post1.date.getDate() +
//       "/" +
//       post1.date.getMonth() +
//       "/" +
//       post1.date.getFullYear();
//     let newObject = {
//       _id: post1._id,
//       userId: post1.userInfo._id,
//       username: post1.userInfo.username,
//       memeUrl: post1.memeUrl,
//       category: post1.category,
//       description: post1.description,
//       date: dateString,
//       likes: post1.likes.length,
//       likedUsers: likedPostsTemp,
//     };
//     return newObject;
//   });
//   if (currentUser) {
//     const { username, _id, imageUser } = currentUser;
//     dataViews = { username, _id, imageUser, post: postsModified };
//     return dataViews;
//   } else {
//     dataViews = { post: postsModified };
//     return dataViews;
//   }
// }

// module.exports = dateFunction;
